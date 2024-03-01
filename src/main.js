class Bathroom {
    constructor() {
        this.firstName
        this.lastName

        this.interval
        this.startTime
        this.endTime

        this.records = []
        this.queue = []

        this.init()
    }
    start() {
        let [firstName, lastName] = [$('#firstName').val(), $('#lastName').val()]
        if (!firstName || !lastName) {
            alert('Please enter both first and last names')
            return
        }

        this.firstName = firstName
        this.lastName = lastName

        this.startTime = new Date()
        this.interval = setInterval(this.update.bind(this), 1000)

        $('#studentNameDisplay').text(this.currentStudent)
        $('#catGraphic').removeClass('hide')
        $('#firstName').prop('disabled', true)
        $('#lastName').prop('disabled', true)
    }

    stop() {
        this.interval = clearInterval(this.interval)
        this.endTime = new Date()

        let record = {
            date: new Date(this.endTime.getTime() - (this.endTime.getTimezoneOffset() * 60000)).toISOString().split('T')[0],

            first: this.firstName,
            last: this.lastName,
            student: this.currentStudent,

            startTime: this.startTime.toTimeString().split(' ')[0],
            endTime: this.endTime.toTimeString().split(' ')[0],

            duration: Math.round((this.endTime - this.startTime) / 1000)
        }

        let records = localStorage.getItem('records') || 'data:text/csv;charset=utf-8,Date,Student,Start Time,End Time,Duration (s)\n'
        records += `${record.date},${record.student},${record.startTime},${record.endTime},${record.duration}\n`
        localStorage.setItem('records', records)

        this.reset()
    }

    // Updates timers, colors, cat src
    update() {
        let elapsedMinutes = Math.floor(this.elapsedSeconds / 60)
        let remainingSeconds = this.elapsedSeconds - elapsedMinutes * 60

        $('#timerDisplay').text(`${elapsedMinutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`)
        $('body').attr('class', this.status)
        $('#catGraphic').attr('src', `../content/${this.status}-cat-alpha.png`)
    }

    // Resets all text & all that
    reset() {
        $('#timerDisplay').text('00:00')
        $('#studentNameDisplay').text('')

        $('body').attr('class', 'happy')
        $('#catGraphic').attr('src', `../content/${this.status}-cat-alpha.png`)
        $('#catGraphic').addClass('hide')


        $('#firstName').prop('disabled', false)
        $('#lastName').prop('disabled', false)

        $('#firstName').val('')
        $('#lastName').val('')
    }

    init() {
        $('#toggleTimer').on('click', () => {
            if (this.interval) this.stop()
            else this.start()
        })
        $('#exportCSV').on('click', () => {
            this.export()
        })
        $('#resetStorage').on('click', () => {
            this.reset_storage()
        })
        $(document).on('keydown', (e) => {
            if (!(e.keyCode === 123 && e.shiftKey && e.altKey && e.ctrlKey)) return
            $('div.secondary#export').toggleClass('hide')
        })
    }

    get currentStudent() {
        return `${this.firstName} ${this.lastName}`
    }
    get elapsedSeconds() {
        if (!this.interval) return 0
        return Math.round((new Date() - this.startTime) / 1000)
    }
    get status() {
        if (this.elapsedSeconds < 300) return 'happy'
        else if (this.elapsedSeconds < 600) return 'unhappy'
        return 'angry'
    }

    export() {
        window.open(encodeURI(localStorage.getItem('records')))
    }
    reset_storage() {
        this.reset()
        localStorage.setItem('records', '')

    }
}

$(document).ready(e => new Bathroom())