
// ==UserScript==
// @name         LSS Simplifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This script simplify the view of the OPU LSS site for enhancing learning experience.
// @author       Kanta Yamaoka
// @match        https://lss.osakafu-u.ac.jp/*
// @grant        none
// ==/UserScript==


(() => {


    var unimportantElementClasses = ['row-fluid',
        'block_navigation',
        'block-region',
        'container-fluid',
        'navbar-inner', 'navbar', 'container-fluid']
    var unimportantElementIds = ['site-news-forum']

    var deleteUnimportantElements = () => {

        unimportantElementClasses.forEach(item => {


            if (document.getElementsByClassName(item)[0] != null) {
                console.log('>>element ', item, ' exists')

                document.getElementsByClassName(item)[0].innerHTML = ''
                document.getElementsByClassName(item)[0].style.visibility = 'none'
                console.log('<<deleted:', item)
            } else {
                console.log('>>! element ', item, ' does not exist')
            }



        })

        unimportantElementIds.forEach(item => {

            if (document.getElementById(item) != null) {
                document.getElementById(item).innerHTML = ''
                document.getElementById(item).style.visibility = 'none'
                console.log('deleted:', item)
            } else {
                console.log('>>! element ', item, ' does not exist')
            }

        })



    }


    var filterCoursesByKeyword = (keyword) => {

        var displayedCourseContains = (i, keyword) => {
            //console.log('courseContains',courseboxes[i].innerText.indexOf(keyword))
            return displayedCourses[i].innerText.toLowerCase().indexOf(keyword.toLowerCase()) >= 0
        }


        for (let i = 0; i < displayedCourses.length; i++) {
            if (displayedCourseContains(i, keyword)) {
                console.log('filtered: ', displayedCourses[i].innerText)
            } else {
                displayedCourses[i].style.display = 'none'
            }



        }
    }



    var initCustomLeftBar = () => {


        var leftBarElement = document.createElement('div')
        var setCSS = (prop, value) => {
            leftBarElement.style[prop] = value
        }

        // document.getElementsByClassName('block-region')[0].innerText = 'test'

        setCSS('position', 'fixed')
        setCSS('top', '10%')
        setCSS('left', '0px')
        setCSS('width', '25%')
        setCSS('height', '85%')
        setCSS('backgroundColor', 'white')
        setCSS('borderRadius', '10px')
        setCSS('border', '2px solid black')
        setCSS('textAlign', 'center')

        leftBarElement.innerHTML = `<h1>授業支援システム拡張機能</h1>
<p>Powererd by Kanta Yamaoka.</p><h3>授業キーワード検索</h3>
<div id='keywordFilterWrapper'><input id='keywordFilterInput'><button id='keywordFilterButton'>検索</button><button id='resetFilterButton'>リセット</button></div>
<h3>現在の授業</h3><p id='clock'>時間読み込み中...</p><p id='currentClassInformation'></p>
<button id='minimizeWindowButton'>拡張機能を閉じる</button>
`



        /*
        leftBarElement.style.position = 'fixed'
        leftBarElement.style.top = '0px'
        leftBarElement.style.left = '0px'
        leftBarElement.style.width = '50px'
        leftBarElement.style.height = '50px'
        leftBarElement.style.backgroundColor = 'black'
        */

        leftBarElement.setAttribute('id','leftBarElement')
        document.body.appendChild(leftBarElement);




        //CSS
        var keywordFilterButtonCSS = () => { return document.getElementById('keywordFilterInput').style }
        keywordFilterButtonCSS().width = '55%'
        keywordFilterButtonCSS().height = '30px'

        document.getElementById('minimizeWindowButton').onclick = () => {
            leftBarElement.style.display = 'none'
            document.getElementById('hiddenStartButton').style.display='block'
        }

        var resetCourses = () => {
            displayedCourses.forEach((courseElement) => {
                console.log('display: block', courseElement.innerText)
                courseElement.style.display = 'block'
            })
        }

        document.getElementById('keywordFilterButton').onclick = () => {
            filterCoursesByKeyword(document.getElementById('keywordFilterInput').value)
        }

        document.getElementById('keywordFilterInput').oninput = () => {
            var keyword = document.getElementById('keywordFilterInput').value
            if (keyword) {
                resetCourses()
                filterCoursesByKeyword(keyword)
            } else {
                //reset
                resetCourses()
            }

        }

        document.getElementById('resetFilterButton').onclick = () => {
            //reset

            document.getElementById('keywordFilterInput').value = ''


            resetCourses()

        }

        document.getElementById('keywordFilterWrapper').onclick = () => {
            var currentUrl = window.location.href
            if (currentUrl == 'https://lss.osakafu-u.ac.jp/' || currentUrl == 'https://lss.osakafu-u.ac.jp') {
                console.log('Top page detected.')
            } else {
                console.log('Current page is not Top page.')
                if (confirm('トップページでのみ授業検索ができます。移動しますか？')) {
                    window.location.href = 'https://lss.osakafu-u.ac.jp/'
                }
            }
        }


    }

    var initHiddenStartButton=()=>{
        var hiddenStartButton=document.createElement('button')
        hiddenStartButton.setAttribute('id','hiddenStartButton')
        hiddenStartButton.innerText='拡張機能を表示する'
        hiddenStartButton.style.position='fixed'
        hiddenStartButton.style.bottom='0px'
        hiddenStartButton.style.left='0px'
        document.body.appendChild(hiddenStartButton)
        hiddenStartButton.style.display='none'
        hiddenStartButton.style.zIndex='100'
        hiddenStartButton.onclick=()=>{
            hiddenStartButton.style.display='none'
            document.getElementById('leftBarElement').style.display='block'
        }

    }

    var courseboxes = document.getElementsByClassName('coursebox')
    var displayedCourses = []

    var courseContains = (i, keyword) => {
        //console.log('courseContains',courseboxes[i].innerText.indexOf(keyword))
        return courseboxes[i].innerText.indexOf(keyword) >= 0
    }

    //hides courses that users already completed
    var initCustomCoursebox = () => {

        for (let i = 0; i < courseboxes.length; i++) {
            if (courseContains(i, '2020前')) {
                console.log('course matched:', courseboxes[i].innerText)
                displayedCourses.push(courseboxes[i])
            } else {
                console.log('completed courses hidden')
                courseboxes[i].style.display = 'none'
            }
        }
    }




    deleteUnimportantElements()
    initCustomLeftBar()
    initCustomCoursebox()
    initHiddenStartButton()



    var refreshClock = () => {
        var date = new Date()
        document.getElementById('clock').innerText = date
    }


    setInterval(refreshClock, 1000)

    //console.log(displayedCourses)
    // filterCoursesByKeyword('電気')



    var date = new Date()


    var day = date.getDay()
    var hours = date.getHours()
    var minutes = date.getMinutes()


    var days_jp = ['日',
        '月',
        '火',
        '水',
        '木',
        '金',
        '土']


    //check if in the betweenle hours

    var lecHours = {
        1: {
            startsAt: '09:00',
            endsAt: '10:30'
        },
        2: {
            startsAt: '10:40',
            endsAt: '12:10'
        },
        3: {
            startsAt: '12:55',
            endsAt: '14:25'
        },
        4: {
            startsAt: '14:35',
            endsAt: '16:05'
        },
        5: {
            startsAt: '16:15',
            endsAt: '17:45'
        }
    }


    var getAbsoluteMinuets = (stringTime) => {
        var hours = parseInt(stringTime.slice(0, 2))
        var minutes = parseInt(stringTime.slice(3, 5))
        return hours * 60 + minutes
    }


    //using getAbsoluteMinuets

    //true or false
    var currentTimeExceedGivenABMTime = (givenABMTime) => {
        var currentABM = hours * 60 + minutes
        if (currentABM >= givenABMTime) {
            return true
        } else {
            return false
        }
    }


    //on progress smaller than or equal to...
    var currentTimeSmallerThanGivenABMTime = (givenABMTime) => {
        var currentABM = hours * 60 + minutes
        if (currentABM <= givenABMTime) {
            return true
        } else {
            return false
        }
    }


    var duringTheGivenPeriod = (startsAt, endsAt) => {
        return currentTimeExceedGivenABMTime(startsAt) && currentTimeSmallerThanGivenABMTime(endsAt)
    }



    var getCurrentCourseHour = () => {

        //numbers or null, when no course hour matched
        var currentCourseHour = null


        for (let i = 1; i <= 5; i++) {

            if (duringTheGivenPeriod(lecHours[i].startsAt, lecHours[i].endsAt)) {
                console.log('during')
                currentCourseHour = i
            } else {
                currentCourseHour = null
            }


        }

        return currentCourseHour

    }

    var getCurrentCourseDayAndHour = () => {
        if (getCurrentCourseHour()) {
            return days_jp[day] + getCurrentCourseHour()
        } else {
            //console.log('error:getCurrentCourseDayAndHour')
            return null
        }
    }



    if (getCurrentCourseDayAndHour()) {
        console.log('now:', getCurrentCourseDayAndHour())
        filterCoursesByKeyword(getCurrentCourseDayAndHour())
        //searchBy getCurrentCourseDayAndHour()
    } else {
        console.log('no course availabla right now')
        document.getElementById('currentClassInformation').innerText = '現在は授業はありません'
    }

    var getSyllabusRedirectUrl = () => {
    var coursePageTitleElement = document.getElementsByClassName('page-context-header')[0];
    if (coursePageTitleElement) {
        var courseTitle = coursePageTitleElement.innerText.split(' ')[1]
        console.log('Now in a course page:', courseTitle)
        var syllabusOriginalUrl = 'http://www0.osakafu-u.ac.jp/syllabus/list01.aspx?CD1=2B12&CD2=01&CD3=01'
        var syllabusRedirectUrl = syllabusOriginalUrl + '&courseTitle=' + courseTitle
        return syllabusRedirectUrl
    } else {
        console.log('not in a course page')
        return null
    }
}
//adds button to syllabus when in course page
if(getSyllabusRedirectUrl()){
    var syllabusRedirectButton=document.createElement('button')
    syllabusRedirectButton.innerText='この授業のシラバスを見る'
    syllabusRedirectButton.onclick=()=>{
        window.open(getSyllabusRedirectUrl())
    }
    document.getElementById('leftBarElement').appendChild(syllabusRedirectButton)
}






})()
