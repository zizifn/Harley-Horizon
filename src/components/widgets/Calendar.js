customElements.define("harley-calendar", class HarleyCalendar extends HTMLElement {
    static observedAttributes = ['dark-mode', 'ymd', 'refer-id', 'init-date', 'style'];

    connectedCallback() {
        const shadow = this.attachShadow({ mode: "open" });
        shadow.appendChild(this.genEle(this.genBaseHtml()));
        const style = document.createElement('style');
        style.textContent = this.genStyle();
        shadow.appendChild(style);
        const WeekArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const MonthArray = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        let inputYear = shadow.querySelector('input.year');
        let inputMonth = shadow.querySelector('input.month');
        let inputDay = shadow.querySelector('input.day');
        let inProgress = false;
        let whichWay;

        // Event handler       
        (() => {
            shadow.querySelector('.date-items.body').addEventListener('focusin', e => {
                const item = e.target.closest('a');
                if (item) {
                    shadow.querySelector('.grid-container .active').classList.remove('active');
                    e.target.closest('a').classList.add('active');
                    updateDatePicker(item);
                }
            });

            shadow.querySelector('.date-items.body').addEventListener('keydown', e => {
                const index = e.target.getAttribute('data-index');
                e.stopImmediatePropagation();
                e.preventDefault();
                if (!inProgress) {
                    if (e.key === 'ArrowRight') {
                        let nextDate = e.target.nextElementSibling;
                        if (nextDate.classList.contains('nextMonth')) {
                            inProgress = true;
                            moveNext();
                        } else {
                            whichWay = 'nextDay';
                            nextDate.focus();
                        }
                    } else if (e.key === 'ArrowLeft') {
                        let preDate = e.target.previousElementSibling;
                        if (preDate && preDate.classList.contains('preMonth')) {
                            inProgress = true;
                            movePrevious();
                        } else {
                            preDate.focus();
                            whichWay = 'preDay';
                        }
                    } else if (e.key === 'ArrowDown') {
                        let nextWeek = e.target.closest('div').querySelector(`a:nth-child(${parseInt(index) + 8})`);
                        if (!nextWeek || nextWeek.classList.contains('nextMonth')) {
                            inProgress = true;
                            moveNext();
                            whichWay = 'nextWeek';
                        } else {
                            nextWeek.focus();
                        }
                    } else if (e.key === 'ArrowUp') {
                        let preWeek = e.target.closest('div').querySelector(`a:nth-child(${parseInt(index) - 6})`);
                        if (!preWeek || preWeek.classList.contains('preMonth')) {
                            inProgress = true;
                            movePrevious();
                        } else {
                            whichWay = 'preWeek';
                            preWeek.focus();
                        }
                    } else if (e.key === 'Enter' || e.key === '') {
                        drawerToggle();
                    } else if (e.key === 'Tab') {
                        e.preventDefault();
                        if (e.shiftKey) {
                            shadow.querySelector('.data-picker-header.right').focus();
                        } else {
                            shadow.querySelector('.clear-btn').focus();
                        }
                    }
                }
            });

            shadow.querySelector('.date-items.body').addEventListener('click', e => {
                const item = e.target.closest('a');
                if (item) {
                    drawerToggle();
                }
            });

            // input events handler input area events start
            shadow.querySelectorAll('.calendar-box input').forEach(item => {
                // update the day based on the month
                item.addEventListener('focus', e => {
                    let input = e.target;
                    if (input.classList.contains('day')) {
                        let year = inputYear.value ? inputYear.value : new Date().getFullYear();
                        let month = inputMonth.value ? inputMonth.value : '01';
                        let maxDay = getDays(year, month);
                        input.setAttribute('max', maxDay + "");
                        if (input.value > maxDay) input.value = maxDay;
                    }
                    shadow.querySelector('.dt-picker-widget').classList.add('active');
                });

                item.addEventListener('blur', e => {
                    let input = e.target;
                    let min = parseInt(input.getAttribute('min'));
                    let disVal = parseInt(input.value);
                    let max = parseInt(input.getAttribute('max'));
                    if (disVal > max) {
                        input.value = max;
                    } else if (disVal < min) {
                        input.value = min;
                    }
                    shadow.querySelector('.dt-picker-widget').classList.remove('active');
                });

                // adding '0' for month and day less than 10
                item.addEventListener('change', (e) => {
                    let input = e.target;
                    if (input.classList.contains('month')) {
                        if (parseInt(input.value) < 10) {
                            input.value = '0' + parseInt(input.value);
                        }
                    } else if (parseInt(input.value) < 10) {
                        input.value = '0' + parseInt(input.value);
                    }
                });

                item.addEventListener('keydown', (e) => {
                    let input = e.target;
                    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        if (input.value === "") {
                            e.preventDefault();
                            if (input.classList.contains('year')) {
                                input.value = new Date().getFullYear();
                            } else if (e.key === 'ArrowUp') {
                                input.value = '01';
                            } else {
                                input.value = input.getAttribute('max');
                            }
                        } else if (!input.classList.contains('year')) {
                            if (e.key === 'ArrowUp' && input.value === input.getAttribute('max')) {
                                e.preventDefault();
                                input.value = '01';
                            }
                            if (e.key === 'ArrowDown' && input.value === '01'){
                                e.preventDefault();
                                input.value = input.getAttribute('max');
                            }
                        }
                    } else if (e.key === 'ArrowRight') {
                        e.target.nextElementSibling?.focus();
                    } else if (e.key === 'ArrowLeft') {
                        e.target.previousElementSibling?.focus();
                    } else if (e.key === ' ') {
                        e.preventDefault();
                        drawerToggle();
                        initDateDrawer('init');
                    }
                    reflectSelected();
                });
            });

            // show drawer
            shadow.querySelector('.date-input-area').addEventListener('click', (e) => {
                if (e.target.closest('a')) {
                    drawerToggle();
                }
                if (shadow.querySelectorAll('.grid-container').length === 0) {
                    initDateDrawer('init');
                }
                document.body.addEventListener('click', closeDrawer);
                window.addEventListener('scroll', closeDrawer);
            });

            // Today button event
            shadow.querySelector('.today-btn').addEventListener('click', e => {
                const items = new Date().toLocaleDateString().split('/');
                resetInput(items)
                shadow.querySelector('.currentDate').textContent = new Date(parseInt(inputMonth.value) + '/' + parseInt(inputDay.value) + '/' + inputYear.value).toDateString();
                drawerToggle();
            });

            shadow.querySelector('.today-btn').addEventListener('keydown', e => {
                e.preventDefault();
                if (e.key === 'Enter' || e.key === ' ') {
                } else if (e.key === 'Tab') {
                    shadow.querySelector('.today-btn').click();
                    if (e.shiftKey) {
                        shadow.querySelector('.year-month-picker .drawer-btn').focus();
                    } else {
                        shadow.querySelector('.clear-btn').focus();
                    }
                }
            });

            // Clear button event
            shadow.querySelector('.clear-btn').addEventListener('click', e => {
                shadow.querySelectorAll('.calendar-box input').forEach(item => {
                    item.value = '';
                });
                if (e.type !== 'click') {
                    shadow.querySelector('.calendar-box input').focus();
                }
                drawerToggle();
            });

            shadow.querySelector('.clear-btn').addEventListener('keydown', e => {
                if (e.shiftKey && e.key === 'Tab') {
                    e.preventDefault();
                    shadow.querySelector('.grid-container:nth-child(2)>a.currentMonth.active').focus();
                }
            });

            // ------------------------------- drawer area events start  ---------------------------------------
            // switch to previous month
            shadow.querySelector('.month-picker .left').addEventListener('click', (e) => {
                if (!inProgress) {
                    inProgress = true;
                    movePrevious();
                    whichWay = 'preMonth';
                }
            });

            // move the focus into date grid
            shadow.querySelector('.month-picker .left').addEventListener('keydown', (e) => {
                if (e.key === 'Tab' && e.shiftKey) {
                    e.preventDefault();
                    shadow.querySelector('.year-month-picker .drawer-btn').focus();
                }
            });

            // switch to next month
            shadow.querySelector('.month-picker .right').addEventListener('click', (e) => {
                if (!inProgress) {
                    inProgress = true;
                    moveNext();
                    whichWay = 'nextMonth';
                }
            });

            // move the focus into date grid
            shadow.querySelector('.month-picker .right').addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        shadow.querySelector('.month-picker .left').focus();
                    } else {
                        shadow.querySelector('.grid-container .current').focus();
                    }
                } else {
                    e.preventDefault();
                }
            });

            // year month picker start
            shadow.querySelector('.year-month-picker .drawer-btn').addEventListener('keydown', (e) => {
                if (e.key === 'Tab' && e.shiftKey) {
                    e.preventDefault();
                    shadow.querySelector('.today-btn').focus();
                }
            });

            shadow.querySelector('.year-month-picker .drawer-btn').addEventListener('click', (e) => {
                shadow.querySelector('.year-month-picker').classList.toggle('expanded');
                let yearOption = '';
                for (let i = 1900; i <= 2100; i++) {
                    yearOption += `<input type="radio" name="year-opt" value="${i}" id="year_opt_${i}" class="year-option" aria-label="${i}"/>`;
                }
                shadow.querySelector('.year-options').innerHTML = yearOption;
                let monthOptions = '';
                for (let i = 0; i < MonthArray.length; i++) {
                    monthOptions += `<input type="radio" name="month-opt" value="${(i + 1) < 10 ? '0' + (i + 1) : i + 1}" id="month_opt_${i}" class="month-option" aria-label="${MonthArray[i].substring(0, 3)}"/>`;
                }
                shadow.querySelector('.month-options').innerHTML = monthOptions;
                // set Active Year and Month
                shadow.querySelector(`.month-options>input:nth-child(${new Date().getMonth() + 1})`).classList.add('current', 'active');
                shadow.querySelectorAll('.year-option').forEach(item => {
                    console.log(parseInt(item.value),parseInt(new Date().getFullYear()) );
                    if (parseInt(item.value) === parseInt(new Date().getFullYear())) {
                        item.checked = true;
                        item.classList.add('current');
                    } else {
                        item.checked = false;
                        item.classList.remove('current');
                    }
                });
                // scroll the Year into the first Row
                shadow.querySelector('.year-options').scrollTop = shadow.querySelector('.year-option.current').offsetTop - 88;
            });

            shadow.querySelector('.year-month-picker .close-drawer').addEventListener('click', e => {
                let days = getDays(inputYear.value, parseInt(inputMonth.value));
                if (inputDay.value) {
                    if (parseInt(new Date().getDate()) < 10) {
                        inputDay.value = '0' + parseInt(new Date().getDate());
                    } else {
                        inputDay.value = new Date().getDate();
                    }
                }
                if (parseInt(inputDay.value) > days) {
                    inputDay.value = days;
                }
                shadow.querySelector('.year-month-picker').classList.toggle('expanded');
                initDateDrawer('init');
            });

            // mode picker
            shadow.querySelector('.dropdown-drawer').addEventListener('click', (e) => {
                const targetItem = e.target;
                if (targetItem.closest('.month-options')) {
                    shadow.querySelector('.month-options.active').classList.remove('active');
                    targetItem.classList.add('active');
                    inputMonth.value = targetItem.getAttribute('data-value');
                }
                if (targetItem.tagName === 'LABEL') {
                    targetItem.previousElementSibling.checked = true;
                    inputYear.value = targetItem.previousElementSibling.value;
                }
            });
        })();

        // when focus the date in the drawer then update the value in the input area
        const updateDatePicker = (selectedDate) => {
            const items = selectedDate.getAttribute('data-ymd').split('/');
            resetInput(items);
        };

        const drawerToggle = () => {
            shadow.querySelector('.date-items.body').innerHTML ='';
            shadow.querySelector('.dt-picker-widget').classList.toggle('show');
            shadow.querySelectorAll('.expanded,.active').forEach(item => {
                item.classList.remove('expanded');
                item.classList.remove('active');
            });
            if (!shadow.querySelector('.dt-picker-widget').classList.contains('show')) {
                document.body.removeEventListener('click', closeDrawer);
                window.removeEventListener('scroll', closeDrawer);
                let year = inputYear.value;
                let month = inputMonth.value;
                let day = inputDay.value;
                if (year && month && day) {
                    this.setAttribute('ymd', year + '/' + month + '/' + day);
                } 
            } else {
                const position = shadow.querySelector('.dt-picker-widget').getBoundingClientRect();
                shadow.querySelector('.dt-picker-widget').setAttribute('style', `--top: ${position.top + 40}px; --left: ${position.left}px`);
            }
        };

        // initialize the Grid drawer
        const initDateDrawer = (status) => {
            let weekOptions = '';
            for (let item of WeekArray) {
                weekOptions += `<div>${item.substring(0, 3)}</div>`;
            }
            shadow.querySelector('.date-items.header').innerHTML = weekOptions;
            shadow.querySelector('.date-items.body').innerHTML = '';
            let currentDate = new Date();
            // default displaying date
            if (inputYear.value && inputMonth.value && inputDay.value && status === 'init') {
                currentDate = buildDateItem();
            }
            buildGridCode(currentDate.getFullYear(), currentDate.getMonth(), false);
            // Bottom grid date
            let bottomDate = getNextMonth();
            buildGridCode(bottomDate.getFullYear(), bottomDate.getMonth(), false);

            // Top grid date
            let topDate = getPreMonth();
            if (status === 'init') {
                buildGridCode(topDate.getFullYear(), topDate.getMonth(), true);
                shadow.querySelector(`.grid-container:nth-child(2)>a.currentMonth[data-ymd="${currentDate.toLocaleDateString()}"]`).focus();
            } else {
                setTimeout(() => {
                    // reset it, use animation slide in
                    buildGridCode(topDate.getFullYear(), topDate.getMonth(), true);
                }, 0);

                // for animation to wait for 200ms
                setTimeout(() => {
                    shadow.querySelector(`.grid-container>.currentMonth[data-ymd="${currentDate.toLocaleDateString()}"]`).focus();
                }, 200);
            }
            // set which month and year
            shadow.querySelector('.year-month-picker .year-month').innerHTML = `<span>${MonthArray[currentDate.getMonth()]}</span>` + currentDate.getFullYear();
        }

        // build month based grid
        const buildGridCode = (year, month, isInit) => {
            let current = new Date();
            current.setYear(year);
            current.setMonth(month, 1);
            // index of day in the month
            const indexOfDay = new Date().getDate();
            // get the index of 1st day in the week.
            const dIndex = current.getDay();
            // get how many days in the month
            const days = getDays(year, month + 1);
            current.setDate(current.getDate() - dIndex - 1);
            let innerContent = '<div class="grid-container" role="grid">';
            let whichMonth = '';
            // generate date grid
            for (let i = 0; i < 42; i++) {
                current.setDate(current.getDate() + 1);
                if (i < dIndex) {
                    whichMonth = 'preMonth';
                } else if (i > (dIndex - 1) && i < (days + dIndex)) {
                    whichMonth = 'currentMonth';
                } else {
                    whichMonth = 'nextMonth';
                }
                innerContent += `<a href="javascript:void(0)" role="cell" data-ymd="${current.toLocaleDateString()}" data-index="${i}"
                    class="${i === indexOfDay + dIndex - 1 && new Date().getMonth() === month && new Date().getFullYear() === year ? 'current active' : ''} ${whichMonth}">
                        <span class="sr-only">${current.toDateString()}</span>
                        <span aria-hidden="true">${current.getDate()}</span>
                </a>`;
            }
            innerContent += '</div>';

            let currentElement;
            if (isInit) {
                shadow.querySelector('.date-items.body').insertBefore(this.genEle(innerContent), shadow.querySelector('.date-items.body div:nth-child(1)'));
                currentElement = shadow.querySelector('.date-items.body div:first-child');
            } else {
                shadow.querySelector('.date-items.body').append(this.genEle(innerContent));
                currentElement = shadow.querySelector('.date-items.body div:last-child');
            }
            return currentElement;
        };

        const moveNext = () => {
            let nextMonth = getNextMonth();
            // set which month and year
            shadow.querySelector('.year-month-picker .year-month').innerHTML = `<span>${MonthArray[nextMonth.getMonth()]}</span> ${nextMonth.getFullYear()}`;
            let current = buildDateItem();
            current.setMonth(current.getMonth() + 2, 1);
            shadow.querySelector('.date-items.body>div:nth-child(1)').remove();
            buildGridCode(current.getFullYear(), current.getMonth(), false);
            addTransition();
        };

        const movePrevious = () => {
            // set which month and year
            let preMonth = getPreMonth();
            shadow.querySelector('.year-month-picker .year-month').innerHTML = `<span>${MonthArray[preMonth.getMonth()]}</span> ${preMonth.getFullYear()}`;
            let current = buildDateItem();
            current.setMonth(current.getMonth() - 2);
            shadow.querySelector('.date-items.body>div:nth-child(3)').remove();
            buildGridCode(current.getFullYear(), current.getMonth(), true);
            addTransition();
        };

        // get the length of the month
        const getDays = (year, month) => {
            return new Date(year, month, 0).getDate();
        };

        const getNextMonth = () => {
            let current = buildDateItem();
            current.setMonth(current.getMonth() + 1, 1);
            return current;
        };

        const getPreMonth = () => {
            let current = buildDateItem();
            current.setMonth(current.getMonth() - 1, 1);
            return current;
        };

        // icon move pre and next month focus
        const moveFocus = (preNext) => {
            let current;
            if (preNext === 'pre') {
                current = getPreMonth();
            } else {
                current = getNextMonth();
            }
            let days = getDays(current.getFullYear(), current.getMonth() + 1);
            // check last day, if previous month doesn't have current day, then focus the last day of previous month.
            if (parseInt(inputDay.value) > days) {
                current.setDate(days);
            } else {
                current.setDate(parseInt(inputDay.value));
            }
            return current;
        };
        // Transition related code for resolving the issue
        const stopTransition = () => {
            inProgress = false;
            let current;
            switch (whichWay) {
                case 'preWeek':
                    current = getPreWeek();
                    break;
                case 'nextWeek':
                    current = getNextWeek();
                    break;
                    
                case 'preDay':
                    current = getPreDay();
                    break;
                case 'nextDay':
                    current = getNextDay();
                    break;
                case 'nextMonth':
                    current = moveFocus('next');
                    break;
                case 'preMonth':   
                    current = moveFocus('pre');
                    break;
            }
            shadow.querySelector(`.grid-container>.currentMonth[data-ymd="${current.toLocaleDateString()}"]`).focus();
            let currentElement = shadow.querySelector('.grid-container:nth-child(2)');
            currentElement.removeEventListener("transitionend", stopTransition);
        };

        // Transition related code for resolving the issue
        const addTransition = () => {
            let currentElement = shadow.querySelector('.grid-container:nth-child(2)');
            currentElement.addEventListener("transitionend", stopTransition);
        };

        const getNextDay = () => {
            let current = buildDateItem();
            current.setDate(current.getDate() + 1);
            return current;
        };

        const getPreDay = () => {
            let current = buildDateItem();
            current.setDate(current.getDate() - 1);
            return current;
        };

        const getNextWeek = () => {
            let current = buildDateItem();
            current.setDate(current.getDate() + 7);
            return current;
        };

        const getPreWeek = () => {
            let current = buildDateItem();
            current.setDate(current.getDate() - 7);
            return current;
        };
        
        const closeDrawer = (e) => {
            if (e.target !== this) {
                drawerToggle();
            }
        };

        // build date object based on input area
        const buildDateItem = () => {
            let currentDate = new Date();
            if (inputYear.value && inputMonth.value && inputDay.value) {
                currentDate.setYear(parseInt(inputYear.value));
                currentDate.setMonth(parseInt(inputMonth.value) - 1);
                currentDate.setDate(parseInt(inputDay.value));
            }
            return currentDate;
        };

        const reflectSelected = () => {
            setTimeout(() => {
                let year = shadow.querySelector('.year');
                let month = shadow.querySelector('.month');
                if (year.value && month.value && day.value) {
                    let day = shadow.querySelector('.day');
                    shadow.querySelector('.currentDate').textContent = new Date(parseInt(month.value) + '/' + parseInt(day.value) + '/' + year.value).toLocaleDateString();
                }
            }, 50);
        };

        const resetInput = (items) =>{
            let year, month, day;

            if (items[0].length === 4){
                year = items[0];
                month = items[1];
                day = items[2];
            } else {
                year = items[2];
                day = items[1];
                month = items[0];
            }

            inputYear.value = year;
            inputMonth.value = parseInt(month) < 10 ? '0' + month : month;
            inputDay.value = parseInt(day) < 10 ? '0' + day : day;
        }
    }

    genBaseHtml() {
        return `<div class="dt-picker-widget ${this.getAttribute('dark-mode')}">
                    <div class="date-input-area">
                        <p class="sr-only" role="alert" aria-automatic="true">Selected date is <span class="currentDate"></span></p>
                        <div class="calendar-box" aria-labelledby="${this.getAttribute('refer-id')}" role="group">
                            <input class="month" type="number" max="12" min="1" placeholder="MM" aria-label="Month" oninput="this.value=this.value.slice(0,2)">/
                            <input class="day" type="number" min="1" max="31" placeholder="DD" aria-label="Day">/
                            <input class="year" type="number" min="21" placeholder="YYYY" aria-label="Year" oninput="this.value=this.value.slice(0,4)">
                            <a href="javascript:void(0)" role="button" aria-hidden="true" tabindex="-1"><svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" fill="white"/><g filter="url(#filter0_d_15_268)"><path d="M3 8.26667V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V8.26667M3 8.26667V5C3 4.44772 3.44772 4 4 4H20C20.5523 4 21 4.44772 21 5V8.26667M3 8.26667H21" stroke="#368727" stroke-linejoin="round"/></g><g filter="url(#filter1_d_15_268)"><path d="M7 2V5" stroke="#368727" stroke-linecap="round" stroke-linejoin="round"/></g><g filter="url(#filter2_d_15_268)"><path d="M17 2V5" stroke="#368727" stroke-linecap="round" stroke-linejoin="round"/></g><g filter="url(#filter3_d_15_268)"><path d="M18 11H16" stroke="#368727" stroke-linecap="round" stroke-linejoin="round"/></g><g filter="url(#filter4_d_15_268)"><path d="M18 17H16" stroke="#368727" stroke-linecap="round" stroke-linejoin="round"/></g><g filter="url(#filter5_d_15_268)"><path d="M13 11H11" stroke="#368727" stroke-linecap="round" stroke-linejoin="round"/></g><g filter="url(#filter6_d_15_268)"><path d="M13 17H11" stroke="#368727" stroke-linecap="round" stroke-linejoin="round"/></g><g filter="url(#filter7_d_15_268)"><path d="M8 11H6" stroke="#368727" stroke-linecap="round" stroke-linejoin="round"/></g><g filter="url(#filter8_d_15_268)"><path d="M8 17H6" stroke="#368727" stroke-linecap="round" stroke-linejoin="round"/></g><g filter="url(#filter9_d_15_268)"><path d="M18 14H16" stroke="#368727" stroke-linecap="round" stroke-linejoin="round"/></g><g filter="url(#filter10_d_15_268)"><path d="M13 14H11" stroke="#368727" stroke-linecap="round" stroke-linejoin="round"/></g><g filter="url(#filter11_d_15_268)"><path d="M8 14H6" stroke="#368727" stroke-linecap="round" stroke-linejoin="round"/></g><defs><filter id="filter0_d_15_268" x="1.5" y="3.5" width="21" height="19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1"/><feGaussianBlur stdDeviation="0.5"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_268"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_268" result="shape"/></filter><filter id="filter1_d_15_268" x="5.5" y="1.5" width="3" height="6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1"/><feGaussianBlur stdDeviation="0.5"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_268"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_268" result="shape"/></filter><filter id="filter2_d_15_268" x="15.5" y="1.5" width="3" height="6" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1"/><feGaussianBlur stdDeviation="0.5"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_268"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_268" result="shape"/></filter><filter id="filter3_d_15_268" x="14.5" y="10.5" width="5" height="3" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1"/><feGaussianBlur stdDeviation="0.5"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_268"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_268" result="shape"/></filter><filter id="filter4_d_15_268" x="14.5" y="16.5" width="5" height="3" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1"/><feGaussianBlur stdDeviation="0.5"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_268"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_268" result="shape"/></filter><filter id="filter5_d_15_268" x="9.5" y="10.5" width="5" height="3" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1"/><feGaussianBlur stdDeviation="0.5"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_268"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_268" result="shape"/></filter><filter id="filter6_d_15_268" x="9.5" y="16.5" width="5" height="3" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1"/><feGaussianBlur stdDeviation="0.5"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_268"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_268" result="shape"/></filter><filter id="filter7_d_15_268" x="4.5" y="10.5" width="5" height="3" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1"/><feGaussianBlur stdDeviation="0.5"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_268"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_268" result="shape"/></filter><filter id="filter8_d_15_268" x="4.5" y="16.5" width="5" height="3" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1"/><feGaussianBlur stdDeviation="0.5"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_268"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_268" result="shape"/></filter><filter id="filter9_d_15_268" x="14.5" y="13.5" width="5" height="3" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1"/><feGaussianBlur stdDeviation="0.5"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_268"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_268" result="shape"/></filter><filter id="filter10_d_15_268" x="9.5" y="13.5" width="5" height="3" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1"/><feGaussianBlur stdDeviation="0.5"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_268"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_268" result="shape"/></filter><filter id="filter11_d_15_268" x="4.5" y="13.5" width="5" height="3" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="1"/><feGaussianBlur stdDeviation="0.5"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_268"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_268" result="shape"/></filter></defs></svg></a>
                        </div>
                    </div>
                    <div class="year-month-picker">
                        <button aria-haspopup="dialog" class="drawer-btn">
                            <span class="year-month"></span>
                            <span class="picker-arrow" aria-label="year month picker arrow"></span>
                        </button>
                        <a href="javascript:void(0)" class="close-drawer"></a>
                        <div class="dropdown-drawer" role="dialog" aria-modal="true">
                            <div class="month-options"></div>
                            <div role="radiogroup" class="year-options scroll-shadows"></div>
                        </div>
                    </div>
                    <div class="container" role="application">
                        <div class="data-picker-header">
                            <div class="month-picker">
                                <a href="javascript:void(0)" class="left active" aria-label="previous month" role="button"></a>
                                <a href="javascript:void(0)" class="right active" aria-label="next month" role="button"></a>
                            </div>
                        </div>
                        <div class="date-items header"></div>
                        <div class="date-items body" role="group"></div>
                        <div class="button-container">
                            <a href="javascript:void(0)" role="button" class="clear-btn">Clear</a>
                            <a href="javascript:void(0)" role="button" class="today-btn">Today</a>
                        </div>
                    </div>
                </div>`;
    };

    genEle = (html) => {
        let temp = document.createElement('template');
        temp.innerHTML = html.trim();
        return temp.content.firstChild;
    };

    genStyle() {
        return `:host{--input-value-color: #141414;--input-border:#abaaa8;--background-color:#fff;--interactive-color:#368727;--secondary-color: #999;--revert-color: #fff;--arrow-color: var(--interactive-color)}:host *{padding:0;margin:0;box-sizing:border-box;font-family:"Fidelity Sans";-webkit-user-select:none;-moz-user-select:none;user-select:none;color:var(--input-value-color)}:host * .sr-only{position:absolute;left:-999rem;z-index:-999}:host a{text-decoration:none;color:var(--interactive-color)}.dt-picker-widget{position:relative}.dt-picker-widget.active .calendar-box{outline:1px solid var(--interactive-color);border-color:var(--interactive-color)}.dt-picker-widget.show .container{display:block}.dt-picker-widget.show .year-month-picker{display:flex}.dt-picker-widget .date-input-area{height:2.25rem;display:inline-flex;gap:1rem;align-items:center}.dt-picker-widget .date-input-area>span{display:none}.dt-picker-widget .date-input-area .calendar-box{width:10.5rem;height:2.25rem;border:1px solid var(--input-border);border-radius:.5rem;display:flex;justify-content:flex-start;align-items:center;padding:.5rem 1rem .5rem .75rem;background-color:var(--background-color);color:var(--input-value-color);position:relative}.dt-picker-widget .date-input-area .calendar-box input[type=number]{border:none;color:var(--input-value-color);border-radius:0;text-align:center;vertical-align:middle;width:1.8rem;height:1.25rem;line-height:1.125rem;font-size:1rem;-webkit-user-select:none;-moz-user-select:none;user-select:none}.dt-picker-widget .date-input-area .calendar-box input[type=number]:focus,.dt-picker-widget .date-input-area .calendar-box input[type=number]:focus-visible,.dt-picker-widget .date-input-area .calendar-box input[type=number]:active{outline:none;background-color:var(--interactive-color);color:rgba(0,0,0,0);text-shadow:0 0 0 var(--background-color);border-radius:3px}.dt-picker-widget .date-input-area .calendar-box input[type=number]:focus::-moz-placeholder, .dt-picker-widget .date-input-area .calendar-box input[type=number]:focus-visible::-moz-placeholder, .dt-picker-widget .date-input-area .calendar-box input[type=number]:active::-moz-placeholder{color:var(--revert-color)}.dt-picker-widget .date-input-area .calendar-box input[type=number]:focus::placeholder,.dt-picker-widget .date-input-area .calendar-box input[type=number]:focus-visible::placeholder,.dt-picker-widget .date-input-area .calendar-box input[type=number]:active::placeholder{color:var(--revert-color)}.dt-picker-widget .date-input-area .calendar-box input[type=number]::-webkit-inner-spin-button{display:none}.dt-picker-widget .date-input-area .calendar-box input[type=number]::-moz-placeholder{font-size:.875rem;color:var(--input-value-color)}.dt-picker-widget .date-input-area .calendar-box input[type=number]::placeholder{font-size:.875rem;color:var(--input-value-color)}.dt-picker-widget .date-input-area .calendar-box input[type=number].year{width:2.5rem}.dt-picker-widget .date-input-area .calendar-box>a{width:1.5rem;height:1.5rem;display:flex;justify-content:center;align-items:center;position:absolute;right:.75rem}.dt-picker-widget .year-month-picker{display:none;width:11.5rem;height:3rem;padding-top:1.125rem;padding-left:1.25rem;position:absolute;z-index:2;-webkit-backdrop-filter:blur(0px);backdrop-filter:blur(0px);transition:-webkit-backdrop-filter .4s linear;transition:backdrop-filter .4s linear;transition:backdrop-filter .4s linear, -webkit-backdrop-filter .4s linear}.dt-picker-widget .year-month-picker .drawer-btn{background-color:var(--background-color);border:none;width:9rem;position:relative;display:flex;align-items:center;height:1.25rem;justify-content:flex-start;cursor:pointer}.dt-picker-widget .year-month-picker .drawer-btn .year-month{width:7.8125rem;font-size:1rem;text-align:left}.dt-picker-widget .year-month-picker .drawer-btn .year-month span{margin-right:.125rem}.dt-picker-widget .year-month-picker .drawer-btn:focus,.dt-picker-widget .year-month-picker .drawer-btn:focus-visible{box-shadow:0 0 0 2px var(--interactive-color);outline:none;border-radius:3px}.dt-picker-widget .year-month-picker .drawer-btn .picker-arrow{border:.3125rem solid rgba(0,0,0,0);border-top:.375rem solid var(--interactive-color);position:absolute;top:.45rem;right:0}.dt-picker-widget .year-month-picker .close-drawer{width:1.5rem;height:1.5rem;position:absolute;right:.5rem;top:1.125rem;display:flex;justify-content:center;align-items:center;display:none}.dt-picker-widget .year-month-picker .close-drawer:before,.dt-picker-widget .year-month-picker .close-drawer:after{display:block;content:"";height:1.2rem;width:0;border-left:1px solid var(--interactive-color);position:absolute;top:0;left:.5rem;transform:rotate(45deg)}.dt-picker-widget .year-month-picker .close-drawer:after{transform:rotate(-45deg)}.dt-picker-widget .year-month-picker .dropdown-drawer{background-color:var(--background-color);border-radius:.5rem;display:none;flex-direction:column;min-height:248px;min-width:367px;overflow-y:auto;padding-left:.5rem;position:absolute;top:3rem;left:.25rem;width:-moz-fit-content;width:fit-content;z-index:2}.dt-picker-widget .year-month-picker .dropdown-drawer .year-options,.dt-picker-widget .year-month-picker .dropdown-drawer .month-options{width:351px;min-height:256px;max-height:256px;overflow-y:auto;display:flex;flex-wrap:wrap;padding:.5rem .25rem 1rem .5rem;gap:1px 0}.dt-picker-widget .year-month-picker .dropdown-drawer .year-options::-webkit-scrollbar,.dt-picker-widget .year-month-picker .dropdown-drawer .month-options::-webkit-scrollbar{display:none}.dt-picker-widget .year-month-picker .dropdown-drawer .year-options::-webkit-scrollbar-track,.dt-picker-widget .year-month-picker .dropdown-drawer .month-options::-webkit-scrollbar-track{width:0}.dt-picker-widget .year-month-picker .dropdown-drawer .year-options input[type=radio],.dt-picker-widget .year-month-picker .dropdown-drawer .month-options input[type=radio]{-webkit-appearance:none;-moz-appearance:none;appearance:none;font-size:.875rem;height:2.25rem;width:4rem;border-radius:1.125rem;position:relative;display:flex;justify-content:center;align-items:center;gap:.75rem;color:var(--input-value-color);margin-right:.25rem;cursor:pointer}.dt-picker-widget .year-month-picker .dropdown-drawer .year-options input[type=radio]:before,.dt-picker-widget .year-month-picker .dropdown-drawer .month-options input[type=radio]:before{display:block;content:attr(aria-label)}.dt-picker-widget .year-month-picker .dropdown-drawer .year-options input[type=radio]:nth-child(5n),.dt-picker-widget .year-month-picker .dropdown-drawer .month-options input[type=radio]:nth-child(5n){margin-right:0}.dt-picker-widget .year-month-picker .dropdown-drawer .year-options input[type=radio]:checked,.dt-picker-widget .year-month-picker .dropdown-drawer .year-options input[type=radio].active,.dt-picker-widget .year-month-picker .dropdown-drawer .month-options input[type=radio]:checked,.dt-picker-widget .year-month-picker .dropdown-drawer .month-options input[type=radio].active{outline:none;color:var(--revert-color);background-color:var(--interactive-color)}.dt-picker-widget .year-month-picker .dropdown-drawer .year-options input[type=radio].current,.dt-picker-widget .year-month-picker .dropdown-drawer .month-options input[type=radio].current{border:1px solid var(--interactive-color);color:var(--interactive-color);background-color:var(--background-color)}.dt-picker-widget .year-month-picker .dropdown-drawer .year-options input[type=radio].current:checked,.dt-picker-widget .year-month-picker .dropdown-drawer .month-options input[type=radio].current:checked{border:none;color:var(--revert-color);background-color:var(--interactive-color)}.dt-picker-widget .year-month-picker .dropdown-drawer .year-options.scroll-shadows,.dt-picker-widget .year-month-picker .dropdown-drawer .month-options.scroll-shadows{max-height:200px;overflow:auto;-webkit-overflow-scrolling:touch;background:linear-gradient(#fff 30%, rgba(255, 255, 255, 0)) center top,linear-gradient(rgba(255, 255, 255, 0), #fff 70%) center bottom,radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)) center top,radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)) center bottom;background-repeat:no-repeat;background-size:100% 40px,100% 40px,100% 14px,100% 14px;background-attachment:local,local,scroll,scroll}.dt-picker-widget .year-month-picker .dropdown-drawer .month-options{height:82px;min-height:unset;padding:.5rem 0;flex-wrap:wrap;border-bottom:.5px solid var(--input-border);gap:unset}.dt-picker-widget .year-month-picker .dropdown-drawer .month-options input[type=radio]{width:3.25rem;height:2rem;border-radius:1rem}.dt-picker-widget .year-month-picker .dropdown-drawer .month-options input[type=radio]:nth-child(5n){margin-right:.25rem}.dt-picker-widget .year-month-picker .dropdown-drawer .month-options input[type=radio]:nth-child(6n){margin-right:0}.dt-picker-widget .year-month-picker.expanded{border-radius:.75rem;background-color:rgba(0,0,0,.7);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);width:375px;height:400px;margin-top:.25rem;z-index:3}.dt-picker-widget .year-month-picker.expanded .drawer-btn{background-color:rgba(0,0,0,0)}.dt-picker-widget .year-month-picker.expanded .drawer-btn .year-month,.dt-picker-widget .year-month-picker.expanded .drawer-btn .mode{color:var(--revert-color)}.dt-picker-widget .year-month-picker.expanded .drawer-btn .year-month span,.dt-picker-widget .year-month-picker.expanded .drawer-btn .mode span{color:var(--revert-color)}.dt-picker-widget .year-month-picker.expanded .drawer-btn .picker-arrow{top:.125rem;border:.3125rem solid rgba(0,0,0,0);border-bottom:.37rem solid var(--interactive-color)}.dt-picker-widget .year-month-picker.expanded .dropdown-drawer,.dt-picker-widget .year-month-picker.expanded .close-drawer{display:flex}.dt-picker-widget .container{width:23.4375rem;padding:.25rem .75rem;background-color:var(--background-color);border-radius:.75rem;box-shadow:0 1px .375rem 0 rgba(32,33,36,.4);position:fixed;top:var(--top);left:var(--left);display:none}.dt-picker-widget .container .data-picker-header{height:2.25rem;display:flex;justify-content:space-between;align-items:center;position:relative;padding:.25rem 1rem 0 .625rem;align-items:center}.dt-picker-widget .container .data-picker-header .month-picker{position:absolute;right:1rem;width:4rem;display:flex;justify-content:space-between;align-items:center}.dt-picker-widget .container .data-picker-header .month-picker .left,.dt-picker-widget .container .data-picker-header .month-picker .right{width:1.5rem;height:1.5rem;display:flex;justify-content:center;align-items:center;position:relative;overflow:hidden}.dt-picker-widget .container .data-picker-header .month-picker .left:focus,.dt-picker-widget .container .data-picker-header .month-picker .left:focus-visible,.dt-picker-widget .container .data-picker-header .month-picker .right:focus,.dt-picker-widget .container .data-picker-header .month-picker .right:focus-visible{box-shadow:0 0 0 .125rem var(--interactive-color);outline:none;border-radius:3px}.dt-picker-widget .container .data-picker-header .month-picker .left:before,.dt-picker-widget .container .data-picker-header .month-picker .right:before{content:"";display:block;border-top:.125rem solid var(--arrow-color);border-left:.125rem solid var(--arrow-color);transform:rotate(45deg);width:.75rem;height:.75rem;position:relative;top:.25rem}.dt-picker-widget .container .data-picker-header .month-picker .right:before{transform:rotate(225deg)}.dt-picker-widget .container .date-items{position:relative}.dt-picker-widget .container .date-items.header{display:flex;justify-content:space-between;align-items:center;flex-direction:row;margin-top:1rem}.dt-picker-widget .container .date-items.header>div{display:flex;justify-content:center;align-items:center;margin:.25rem;width:2.5rem;height:2.5rem;border-radius:50%;color:var(--input-value-color) !important;background-color:var(--background-color);font-size:1rem;position:static}.dt-picker-widget .container .date-items.body{height:18rem;overflow:hidden}.dt-picker-widget .container .date-items.body>div{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;position:absolute;background-color:var(--background-color);transition:all .4s linear;height:18rem}.dt-picker-widget .container .date-items.body>div:first-child{top:-18rem}.dt-picker-widget .container .date-items.body>div:nth-child(2){top:0}.dt-picker-widget .container .date-items.body>div:last-child{top:18rem}.dt-picker-widget .container .date-items.body>div>*{margin:.25rem;width:2.5rem;height:2.5rem;border-radius:50%;color:var(--input-value-color) !important;background-color:var(--background-color);display:flex;justify-content:center;align-items:center;font-size:1rem}.dt-picker-widget .container .date-items.body>div>*.preMonth>span,.dt-picker-widget .container .date-items.body>div>*.nextMonth>span{color:var(--secondary-color) !important}.dt-picker-widget .container .date-items.body>div>*.active{background-color:var(--interactive-color)}.dt-picker-widget .container .date-items.body>div>*.active>span{color:var(--revert-color) !important}.dt-picker-widget .container .date-items.body>div>*.current{border:1px solid var(--interactive-color)}.dt-picker-widget .container .date-items.body>div>*.current>span{color:var(--interactive-color)}.dt-picker-widget .container .date-items.body>div>*.current.active{background-color:var(--interactive-color);border:none}.dt-picker-widget .container .date-items.body>div>*.current.active span{color:var(--revert-color) !important}.dt-picker-widget .container .date-items.body>div>*:focus,.dt-picker-widget .container .date-items.body>div>*:focus-visible{box-shadow:0 0 .25rem 0 var(--interactive-color);outline:none}.dt-picker-widget .container .button-container{width:100%;display:flex;justify-content:space-between;align-items:center;padding:0 .5rem;margin-bottom:.75rem;margin-top:1rem;font-weight:500;color:var(--interactive-color) !important}.dt-picker-widget .container .button-container>a{padding:.25rem .5rem;border-radius:.5rem}.dt-picker-widget .container .button-container>a:focus,.dt-picker-widget .container .button-container>a:focus-visible{box-shadow:0 0 .25rem 1px var(--interactive-color)}`;
    }

    attributeChangedCallback(ns, oldValue, newValue) {
        if (oldValue!== newValue) {
            this.dispatchEvent(new Event('change', { bubbles: true }));
        }
    };
});