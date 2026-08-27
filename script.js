/*
    ==========================================
    GLOBAL WORKDAY CLOCK
    ==========================================

    Add additional clocks here.

    timezone must be a valid IANA timezone.

    Examples:
        Asia/Kolkata
        America/New_York
        Europe/London
        Asia/Tokyo
        Australia/Sydney
*/


const clocks = [
    {
        name: "India",
        flag: "🇮🇳",
        timezone: "Asia/Kolkata"
    },

    {
        name: "North Carolina",
        flag: "🇺🇸",
        timezone: "America/New_York"
    }
];


/*
    ==========================================
    WORKDAY
    ==========================================
*/

const workStart = "09:30";
const workEnd = "18:30";

const indiaTimezone = "Asia/Kolkata";


/*
    ==========================================
    DOM
    ==========================================
*/

const clocksContainer =
    document.getElementById("clocks");

const currentTimeElement =
    document.getElementById("currentTime");

const currentTimeBottomElement =
    document.getElementById("currentTimeBottom");

const elapsedLabel =
    document.getElementById("elapsedLabel");

const elapsedTimeElement =
    document.getElementById("elapsedTime");

const remainingTimeElement =
    document.getElementById("remainingTime");

const remainingTimeBottomElement =
    document.getElementById("remainingTimeBottom");

const progressPercentElement =
    document.getElementById("progressPercent");

const progressBar =
    document.getElementById("progressBar");

const progressMarker =
    document.getElementById("progressMarker");

const timelineTable =
    document.getElementById("timelineTable");


/*
    ==========================================
    TIMEZONE HELPERS
    ==========================================
*/


function getTimezoneParts(timezone) {

    const now = new Date();

    const formatter =
        new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false
        });

    const parts =
        formatter.formatToParts(now);

    const values = {};

    parts.forEach(part => {

        if (
            part.type === "hour" ||
            part.type === "minute" ||
            part.type === "second"
        ) {
            values[part.type] =
                Number(part.value);
        }

    });

    return values;
}


function getTimeParts(timezone) {

    const now = new Date();

    const formatter =
        new Intl.DateTimeFormat("en-US", {
            timeZone: timezone,
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true
        });

    const parts =
        formatter.formatToParts(now);

    const values = {};

    parts.forEach(part => {

        if (
            part.type === "hour" ||
            part.type === "minute" ||
            part.type === "second" ||
            part.type === "dayPeriod"
        ) {
            values[part.type] = part.value;
        }

    });

    return values;
}


function getDate(timezone) {

    const now = new Date();

    return new Intl.DateTimeFormat(
        "en-US",
        {
            timeZone: timezone,
            weekday: "long",
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    ).format(now);
}


/*
    ==========================================
    FORMAT TIME
========================================== */

function format12HourTime(timezone) {

    const parts =
        getTimeParts(timezone);

    return {
        hour: parts.hour,
        minute: parts.minute,
        second: parts.second,
        period: parts.dayPeriod
    };
}


function formatShortTime(timezone) {

    const parts =
        getTimeParts(timezone);

    return `${parts.hour}:${parts.minute} ${parts.dayPeriod}`;
}


/*
    ==========================================
    ANALOG CLOCK
    ==========================================
*/


function createAnalogClock(index) {

    let html = `
        <div
            class="analog-clock"
            id="analog-clock-${index}"
        >
    `;


    /*
        Create 60 tick marks.
    */

    for (let i = 0; i < 60; i++) {

        const angle = i * 6;

        const major =
            i % 5 === 0
                ? "major"
                : "";

        html += `
            <div
                class="clock-tick ${major}"
                style="transform: rotate(${angle}deg)"
            ></div>
        `;

    }


    /*
        Create 12 numbers.
    */

    for (let number = 1; number <= 12; number++) {

        const angle =
            number * 30;

        const radius = 70;

        const x =
            Math.sin(angle * Math.PI / 180) *
            radius;

        const y =
            -Math.cos(angle * Math.PI / 180) *
            radius;

        html += `
            <div
                class="clock-number"
                style="
                    left: calc(50% + ${x}px);
                    top: calc(50% + ${y}px);
                "
            >
                ${number}
            </div>
        `;

    }


    /*
        Clock hands.
    */

    html += `
        <div
            class="clock-hand hour-hand"
            id="hour-hand-${index}"
        ></div>

        <div
            class="clock-hand minute-hand"
            id="minute-hand-${index}"
        ></div>

        <div
            class="clock-hand second-hand"
            id="second-hand-${index}"
        ></div>

        <div class="clock-center"></div>

        </div>
    `;

    return html;
}


/*
    ==========================================
    RENDER CLOCK CARDS
    ==========================================
*/

function renderClocks() {

    clocksContainer.innerHTML = "";

    clocks.forEach((clock, index) => {

        const card =
            document.createElement("div");

        card.className =
            "clock-card";

        card.innerHTML = `

            ${createAnalogClock(index)}

            <div class="clock-info">

                <div class="clock-location">

                    <div class="clock-flag">
                        ${clock.flag}
                    </div>

                    <div>

                        <div class="clock-name">
                            ${clock.name}
                        </div>

                        <div class="clock-zone">
                            ${clock.timezone}
                        </div>

                    </div>

                </div>


                <div class="clock-time">

                    <span id="clock-hour-${index}">
                        --
                    </span>

                    <span>:</span>

                    <span id="clock-minute-${index}">
                        --
                    </span>

                    <span>:</span>

                    <span id="clock-second-${index}">
                        --
                    </span>

                    <span
                        class="clock-period"
                        id="clock-period-${index}"
                    >
                        --
                    </span>

                </div>


                <div
                    class="clock-date"
                    id="clock-date-${index}"
                >
                    --
                </div>

            </div>
        `;

        clocksContainer.appendChild(card);

    });
}


/*
    ==========================================
    UPDATE DIGITAL + ANALOG CLOCKS
    ==========================================
*/

function updateClocks() {

    clocks.forEach((clock, index) => {

        const time =
            format12HourTime(clock.timezone);


        /*
            Digital clock
        */

        document.getElementById(
            `clock-hour-${index}`
        ).textContent = time.hour;

        document.getElementById(
            `clock-minute-${index}`
        ).textContent = time.minute;

        document.getElementById(
            `clock-second-${index}`
        ).textContent = time.second;

        document.getElementById(
            `clock-period-${index}`
        ).textContent = time.period;


        document.getElementById(
            `clock-date-${index}`
        ).textContent =
            getDate(clock.timezone);


        /*
            Analog clock
        */

        const numeric =
            getTimezoneParts(clock.timezone);

        const hour =
            numeric.hour % 12;

        const minute =
            numeric.minute;

        const second =
            numeric.second;


        const hourAngle =
            hour * 30 +
            minute * 0.5;

        const minuteAngle =
            minute * 6 +
            second * 0.1;

        const secondAngle =
            second * 6;


        document.getElementById(
            `hour-hand-${index}`
        ).style.transform =
            `rotate(${hourAngle}deg)`;


        document.getElementById(
            `minute-hand-${index}`
        ).style.transform =
            `rotate(${minuteAngle}deg)`;


        document.getElementById(
            `second-hand-${index}`
        ).style.transform =
            `rotate(${secondAngle}deg)`;

    });
}


/*
    ==========================================
    WORKDAY MINUTES
    ==========================================
*/

function getWorkdayMinutes() {

    const [startHour, startMinute] =
        workStart.split(":").map(Number);

    const [endHour, endMinute] =
        workEnd.split(":").map(Number);

    return {
        start:
            startHour * 60 +
            startMinute,

        end:
            endHour * 60 +
            endMinute
    };
}


function getCurrentIndiaMinutes() {

    const parts =
        getTimezoneParts(indiaTimezone);

    return (
        parts.hour * 60 +
        parts.minute +
        parts.second / 60
    );
}


/*
    ==========================================
    DURATION
    ==========================================
*/

function formatDuration(totalMinutes) {

    totalMinutes =
        Math.max(0, totalMinutes);

    const hours =
        Math.floor(totalMinutes / 60);

    const minutes =
        Math.floor(totalMinutes % 60);

    return `${hours}h ${minutes}m`;
}


/*
    ==========================================
    WORKDAY
    ==========================================
*/

function updateWorkday() {

    const {
        start,
        end
    } = getWorkdayMinutes();


    const current =
        getCurrentIndiaMinutes();


    const currentTime =
        formatShortTime(indiaTimezone);


    currentTimeElement.textContent =
        currentTime;

    currentTimeBottomElement.textContent =
        currentTime;


    /*
        Progress
    */

    let progress =
        ((current - start) /
        (end - start)) * 100;

    progress =
        Math.min(
            100,
            Math.max(0, progress)
        );


    /*
        Elapsed / remaining
    */

    const elapsed =
        Math.max(
            0,
            Math.min(
                current - start,
                end - start
            )
        );


    const remaining =
        Math.max(
            0,
            end - current
        );


    elapsedTimeElement.textContent =
        formatDuration(elapsed);

    elapsedLabel.textContent =
        `Elapsed: ${formatDuration(elapsed)}`;


    remainingTimeElement.textContent =
        formatDuration(remaining);

    remainingTimeBottomElement.textContent =
        formatDuration(remaining);


    progressPercentElement.textContent =
        `${progress.toFixed(1)}% of workday completed`;


    progressBar.style.width =
        `${progress}%`;

    progressMarker.style.left =
        `${progress}%`;


    renderTimeline();
}


/*
    ==========================================
    TIMELINE
    ==========================================
*/


function getIndiaDateParts() {

    const now = new Date();

    const formatter =
        new Intl.DateTimeFormat(
            "en-US",
            {
                timeZone: indiaTimezone,
                year: "numeric",
                month: "numeric",
                day: "numeric"
            }
        );

    const parts =
        formatter.formatToParts(now);

    const values = {};

    parts.forEach(part => {

        if (
            part.type === "year" ||
            part.type === "month" ||
            part.type === "day"
        ) {
            values[part.type] =
                Number(part.value);
        }

    });

    return values;
}


/*
    Convert an India local time such as
    09:30 AM into an actual Date instant.

    India is UTC+05:30.
*/

function indiaTimeToDate(hour24, minute) {

    const date =
        getIndiaDateParts();

    const utc =
        Date.UTC(
            date.year,
            date.month - 1,
            date.day,
            hour24,
            minute
        );

    return new Date(
        utc - (5 * 60 + 30) * 60 * 1000
    );
}


/*
    Format an actual instant inside
    a requested timezone.
*/

function formatDateInTimezone(
    date,
    timezone
) {

    return new Intl.DateTimeFormat(
        "en-US",
        {
            timeZone: timezone,
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }
    ).format(date);
}


/*
    Determine which timeline column
    represents the current India hour.
*/

function getCurrentTimelineIndex() {

    const current =
        getCurrentIndiaMinutes();

    const {
        start,
        end
    } = getWorkdayMinutes();


    if (
        current < start ||
        current > end
    ) {
        return -1;
    }


    return Math.floor(
        (current - start) / 60
    );
}


/*
    Build timeline.
*/

function renderTimeline() {

    const {
        start,
        end
    } = getWorkdayMinutes();


    const currentIndex =
        getCurrentTimelineIndex();


    let html = `
        <thead>
            <tr>
                <th>Location</th>
    `;


    const timelinePoints = [];


    /*
        Create 09:30 → 18:30
    */

    for (
        let minutes = start;
        minutes <= end;
        minutes += 60
    ) {

        const hour =
            Math.floor(minutes / 60);

        const minute =
            minutes % 60;

        timelinePoints.push({
            hour,
            minute
        });

    }


    /*
        Header = India time
    */

    timelinePoints.forEach(
        (point, index) => {

            const date =
                indiaTimeToDate(
                    point.hour,
                    point.minute
                );

            const label =
                formatDateInTimezone(
                    date,
                    indiaTimezone
                );

            html += `
                <th class="${
                    index === currentIndex
                        ? "current-cell"
                        : ""
                }">
                    ${label}
                </th>
            `;

        }
    );


    html += `
            </tr>
        </thead>

        <tbody>
    `;


    /*
        Clock rows
    */

    clocks.forEach(clock => {

        const locationClass =
            clock.name === "India"
                ? "location-india"
                : "location-nc";


        html += `
            <tr>

                <td class="${locationClass}">
                    ${clock.flag} ${clock.name}
                </td>
        `;


        timelinePoints.forEach(
            (point, index) => {

                const date =
                    indiaTimeToDate(
                        point.hour,
                        point.minute
                    );


                const localTime =
                    formatDateInTimezone(
                        date,
                        clock.timezone
                    );


                html += `
                    <td class="${
                        index === currentIndex
                            ? "current-cell"
                            : ""
                    }">
                        ${localTime}
                    </td>
                `;

            }
        );


        html += `
            </tr>
        `;

    });


    /*
        Remaining row
    */

    html += `
        <tr class="remaining-row">

            <td>
                ⏳ HOURS REMAINING
            </td>
    `;


    timelinePoints.forEach(
        (point, index) => {

            const remaining =
                end -
                (
                    point.hour * 60 +
                    point.minute
                );


            html += `
                <td class="${
                    index === currentIndex
                        ? "current-cell"
                        : ""
                }">
                    ${formatDuration(remaining)}
                </td>
            `;

        }
    );


    html += `
        </tr>
        </tbody>
    `;


    timelineTable.innerHTML =
        html;
}


/*
    ==========================================
    INITIALIZE
    ==========================================
*/

renderClocks();

updateClocks();

updateWorkday();


/*
    Update every second.
*/

setInterval(() => {

    updateClocks();

    updateWorkday();

}, 1000);