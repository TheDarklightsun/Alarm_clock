//adds element in js
const currentTime = document.getElementById('time');
const  input = document.getElementById('add');
const setAlarming = document.getElementById('set-alarm-btn');
const fullscreen_alarm = document.querySelector(".fullscreen-alarm")
const fullscreen_alarm_text = document.querySelector(".fullscreen-alarm-text")
const fullscreen_alarm_stop_btn = document.querySelector(".alarm-stop")
const alarmList = document.getElementById('alarm-list-display');

//adds audio
const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
audio.loop = true;

//add alarms in localStorage
let alarms = JSON.parse(localStorage.getItem('alarms')) || [];

//adds time
let today = new Date();
let currentHours = today.getHours();
let currentMinutes = today.getMinutes();
let currentSeconds = today.getSeconds();
let time = currentHours + ":" + currentMinutes + ":" + currentSeconds;
currentTime.innerHTML = time;

// Updating current time every second
function timeInterval() {
    today = new Date();
    currentHours = today.getHours();
    currentHours = ("0"+currentHours).slice(-2);
    currentMinutes = today.getMinutes();
    currentMinutes = ("0"+currentMinutes).slice(-2);
    currentSeconds = today.getSeconds();
    currentSeconds = ("0"+currentSeconds).slice(-2);
    time =  currentHours + ":" + currentMinutes + ":" + currentSeconds;
    currentTime.innerHTML = time;
}
setInterval(timeInterval,1000);

/* checking from alarm list for alarm every second.
1)deleteAlarm - deleting a specific element
2)displayNone - off audio
*/
function checkAlarm() {
    for (let i = 0; i < alarms.length; i++) {
        if (currentTime.innerHTML === alarms[i]) {
            setTimeout(function () {
                audio.play();
            }, 2);

            deleteAlarm(alarms[i]);

            fullscreen_alarm.style.display = 'block';
            fullscreen_alarm_text.innerHTML = localStorage.getItem("alarm-text")

            function displayNone() {
                if (fullscreen_alarm.style.display === 'block') {
                    setTimeout(function () {
                        audio.stop();
                    }, 1);
                }
            }
            setTimeout(displayNone, 15000);
        }
    }
    localStorage.setItem('alarms', JSON.stringify(alarms));
}
setInterval(checkAlarm,1000);

//add alarm in HTML
function addAlarmToDom(alarm){
    let id = alarm;
    const ul = document.createElement('section');
    ul.innerHTML = `
				<div class="alarm-list-display-time" id="${id}">
						${alarm}
				</div>
				<div class="delete" id="alarm-list-display-delete-btn" data-id="${id}">Delete</div>
			`
    alarmList.append(ul);
}

// for showing list of alarms, Alarm List is rendered below.
function renderList() {
    alarmList.innerHTML = '';
    for(let i = 0; i < alarms.length; i++){
        addAlarmToDom(alarms[i]);
    }
    localStorage.setItem('alarms', JSON.stringify(alarms));
}

// For deleting alarm from list
function deleteAlarm(alarmId) {
    let newAlarms = alarms.filter(function(alarm){
        return alarm !== alarmId
    });
    alarms = newAlarms;
    renderList();
    return alarmId;
}

// before rendering alarm must be added to array of AlarmList by below code
function addAlarm(alarm) {
    if(alarm){
        alarms.push(alarm);
        renderList();
        return alarm;
    }
}

// handler for deleting alarm
function handleClickListener(e){
    const target = e.target;
    if(target.className === 'delete'){
        const alarmId = target.dataset.id;
        deleteAlarm(alarmId);
        return target;
    }
}

// handler for setting Alarm
function setAlarmListener(){
    let newAlarms = alarms.filter(function(alarm){
        return alarm === input.value;
    });
    localStorage.setItem('alarms', JSON.stringify(alarms));
    if(newAlarms.length===0){
        addAlarm(input.value);
        return newAlarms;
    } else {
        alert("Same alarm exist")
        return newAlarms;
    }
}

// starting of App by below code
function initializeApp(){
    document.addEventListener('click',handleClickListener);
    setAlarming.addEventListener('click', setAlarmListener);
    addAlarmToDom(alarms, alarms)
}

//correct audio mute
HTMLAudioElement.prototype.stop = function () {
    this.pause();
    this.currentTime = 0.0;
};

//adds a reload button
fullscreen_alarm_stop_btn.onclick = function () {
    location.reload();
    localStorage.setItem('alarms', JSON.stringify(alarms));
}
initializeApp()


