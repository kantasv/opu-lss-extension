// ==UserScript==
// @name         LSS Syllabus Redirector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  情報工学課程の人が、このリポジトリにあるLSS_simplifier.jsと一緒にこれをインストールすることで、授業の画面からボタンを押すとシラバスの画面を開くことができる画期的ツールです
// @author       Kanta Yamaoka
// @match        http://www0.osakafu-u.ac.jp/syllabus/list01.aspx*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    //this returns only one element with the given keyword
    var getATagElementByKeyword = (keyword) => {
        var aTagElements = document.querySelectorAll('a')
        for (var i = 0; i < aTagElements.length; i++) {
            var containsKeyword = aTagElements[i].innerText.indexOf(keyword) != -1
            if (containsKeyword) {
                return aTagElements[i]
            }
        }
        return null
    }


    var courseTitle
    var url = window.location.href
    var urlParameters = url.split('&')
    urlParameters.forEach(parameter => {
        var courseTitleExists = parameter.indexOf('courseTitle') != -1
        if (courseTitleExists) {
            var rawCourseTitle = parameter.split('=')[1]
            courseTitle = decodeURI(rawCourseTitle)
        }
    })
    if (courseTitle) {
        console.log('courseTitle detected: ', courseTitle)
        var isCourseAcademicEnglish=courseTitle.indexOf('Academic')!=-1
        if(isCourseAcademicEnglish){
            alert('Academic Englishは自動シラバス表示に対応していません。Control+Fにて手動でページ内検索をしてください')
        }else{
        var redirectUrl = getATagElementByKeyword(courseTitle).href
        window.location.href = redirectUrl
        }

    } else {
        console.log('courseTitle not detected')
    }



})();



