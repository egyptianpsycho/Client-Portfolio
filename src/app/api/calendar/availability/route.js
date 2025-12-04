//api/calendar/availability/route.js
import { listEvents } from "@/app/utils/googleCalendar";
import {
  startOfDay,
  addDays,
  addMinutes,
  setHours,
  setMinutes,
  formatISO,
  isBefore,
  parseISO,
  isAfter,
  isValid,
} from "date-fns";
import { NextResponse } from "next/server";

const {
  WORK_START_HOUR = "8",
  WORK_END_HOUR = "22",
  SLOT_MINUTES = "60",
} = process.env;

// Helper: given busy events returns slots of length SLOT_MINUTES for a day
function computeSlotsForDay(dayStart, events, slotMinutes) {
  const slots = [];
  
  try {
    const workStart = setMinutes(
      setHours(dayStart, parseInt(WORK_START_HOUR, 10)),
      0
    );
    const workEnd = setMinutes(
      setHours(dayStart, parseInt(WORK_END_HOUR, 10)),
      0
    );

    // Build busy ranges for the day
    const busyRanges = events
      .map((ev) => {
        try {
          // Handle both dateTime and date formats
          const startStr = ev.start?.dateTime || ev.start?.date;
          const endStr = ev.end?.dateTime || ev.end?.date;
          
          if (!startStr || !endStr) {
            console.warn("Event missing start or end time:", ev.summary);
            return null;
          }
          
          const start = parseISO(startStr);
          const end = parseISO(endStr);
          
          if (!isValid(start) || !isValid(end)) {
            console.warn("Invalid event dates:", ev.summary);
            return null;
          }
          
          return { start, end };
        } catch (error) {
          console.error("Error parsing event date:", error, ev);
          return null;
        }
      })
      .filter(Boolean); // Remove null entries

    // Iterate from workStart to workEnd by slotMinutes
    let cursor = new Date(workStart);
    const now = new Date();

    while (isBefore(cursor, workEnd)) {
      const slotStart = new Date(cursor);
      const slotEnd = addMinutes(slotStart, slotMinutes);

      // If slotEnd is beyond workEnd, break
      if (isAfter(slotEnd, workEnd)) break;

      // Skip slots in the past
      if (isBefore(slotEnd, now)) {
        cursor = addMinutes(cursor, slotMinutes);
        continue;
      }

      // Check overlap with busyRanges
      const overlap = busyRanges.some((b) => {
        // Two time ranges overlap if: slotStart < busyEnd AND slotEnd > busyStart
        return isBefore(slotStart, b.end) && isAfter(slotEnd, b.start);
      });

      if (!overlap) {
        slots.push({
          start: slotStart.toISOString(),
          end: slotEnd.toISOString(),
        });
      }

      cursor = addMinutes(cursor, slotMinutes);
    }
  } catch (error) {
    console.error("Error computing slots for day:", error);
  }

  return slots;
}

// The GET handler for /api/calendar/availability
export async function GET(request) {
  console.log("📅 Availability route called");
  
  try {
    const { searchParams } = new URL(request.url);

    // Get query parameters for range
    const days = parseInt(searchParams.get("days") || "14", 10);
    const slotMinutes = parseInt(SLOT_MINUTES, 10);

    console.log(`📊 Fetching ${days} days of availability (${slotMinutes}min slots)`);

    // Validate slot minutes
    if (isNaN(slotMinutes) || slotMinutes <= 0) {
      throw new Error(`Invalid SLOT_MINUTES: ${SLOT_MINUTES}`);
    }

    // Start from today at midnight
    const today = startOfDay(new Date());
    const startISO = formatISO(today);
    
    // Fetch events for the requested number of days
    const endDate = addDays(today, days);
    const endISO = formatISO(endDate);

    console.log(`🔍 Querying range: ${startISO} to ${endISO}`);

    // List all events in range
    let events = [];
    try {
      events = await listEvents(startISO, endISO);
      console.log(`✅ Found ${events.length} calendar events`);
    } catch (calendarError) {
      console.error("❌ Calendar API error:", calendarError.message);
      
      // Return a more helpful error
      return NextResponse.json(
        { 
          error: "Unable to connect to calendar service",
          details: calendarError.message,
          available: [] // Return empty array so UI doesn't break
        },
        { status: 500 }
      );
    }

    // Group events by day (date string YYYY-MM-DD)
    const grouped = {};
    for (const ev of events) {
      try {
        const eventStartStr = ev.start?.dateTime || ev.start?.date;
        if (!eventStartStr) {
          console.warn("Skipping event without start time:", ev.summary);
          continue;
        }
        
        const eventStart = parseISO(eventStartStr);
        
        if (!isValid(eventStart)) {
          console.warn("Skipping event with invalid date:", ev.summary);
          continue;
        }
        
        const dayKey = formatISO(startOfDay(eventStart), { representation: 'date' });
        
        if (!grouped[dayKey]) {
          grouped[dayKey] = [];
        }
        grouped[dayKey].push(ev);
      } catch (error) {
        console.error("Error grouping event:", error, ev);
      }
    }

    console.log(`📦 Events grouped into ${Object.keys(grouped).length} days`);

    // Calculate available slots for each day
    const available = [];
    for (let i = 0; i < days; i++) {
      const day = addDays(today, i);
      const dayKey = formatISO(day, { representation: 'date' });
      const busy = grouped[dayKey] || [];
      
      const slots = computeSlotsForDay(day, busy, slotMinutes);
      
      // Only include days that have available slots
      if (slots.length > 0) {
        available.push({
          date: dayKey,
          slots,
        });
      }
    }

    console.log(`✅ Returning ${available.length} days with available slots`);

    return NextResponse.json({ 
      available,
      metadata: {
        totalDays: days,
        daysWithSlots: available.length,
        workHours: `${WORK_START_HOUR}:00 - ${WORK_END_HOUR}:00`,
        slotDuration: `${slotMinutes} minutes`
      }
    });
    
  } catch (err) {
    console.error("❌ Availability Error:", err);
    console.error("Stack trace:", err.stack);
    
    return NextResponse.json(
      { 
        error: err.message || "server error",
        details: process.env.NODE_ENV === "development" ? err.stack : undefined,
        available: [] // Return empty array so UI doesn't break
      },
      { status: 500 }
    );
  }
}