import * as $ from 'jquery';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import graph from './graphs.js';
import badges from './badges.js';
import badge from 'project-badge/dist/badge.js';
import button from './button.js';
import loading from './loading.js';

const repoName = window.location.pathname;
let accessToken = null;

var content = saveClass("new-discussion-timeline experiment-repo-nav")
var repoContent = saveClass("repository-content")
var metrics = [{
    active_indicator: null,
    welcoming_indicator: null,
    support_indicator: null,
    commit_graph: {
        x_axis: null,
        y_axis: null
    }
}]
var popup_key = ""

chrome.storage.sync.get("active", function(res) {
    popup_key = res.active
    if(popup_key != false){
        getAcessToken()
    }
});

/**
 * Return url to hubcare api
 * @param {string} repoName 
 */
const getApiUrl = (repoName) =>
    `https://hubcare.ml/hubcare_indicators${repoName}/`;

function createBadge(text, progress, id){
    var myBadge = new badge.Progress({
        text: text,
        progress: progress
    });
    document.getElementById(id).appendChild(myBadge.asDOMNode())
}

function saveClass(name_class){
    var element = document.getElementsByClassName(name_class)
    return element
}

function cleanPageContent(){
    var element = document.getElementsByClassName('repository-content ')
    element[0].parentNode.removeChild(element[0])
}

function createCommitChart(){
    var content = document.getElementsByClassName("new-discussion-timeline experiment-repo-nav")
    var repoContent = document.getElementsByClassName("repository-content")
    var node = document.createElement('div')
    node.innerHTML = graph()
    content[0].insertBefore(node, repoContent[0])
    var myChart = echarts.init(document.getElementById('my-graph'))
    var option = {
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: metrics[0].commit_graph.x_axis
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: metrics[0].commit_graph.y_axis,
            type: 'line'
            
        }]
    }
    myChart.setOption(option)
}

/**
 * Create latel to pull request interaction graph
 */
const createLabel = (score) => {
    return {
        normal: {
        formatter: '{a|{b}}{abg|}\n{hr|}\n{b|Score:  ' + score + '}  {per|{d}%}  ',
        backgroundColor: '#eee',
        borderColor: '#aaa',
        borderWidth: 1,
        borderRadius: 4,
        rich: {
            a: {
                color: '#586069',
                lineHeight: 22,
                align: 'center',
                fontSize: 14
            },
            hr: {
                borderColor: '#aaa',
                width: '100%',
                borderWidth: 0.5,
                height: 0
            },
            b: {
                color: '#586069',
                fontSize: 14,
                lineHeight: 22
            },
            per: {
                color: '#eee',
                backgroundColor: '#334455',
                padding: [2, 4],
                borderRadius: 2,
                lineHeight: 22
            }
        }
    }
}
}

/**
 * Create pull request graph
 */
const createPullRequestChart = () => {
    var content = document.getElementsByClassName("new-discussion-timeline experiment-repo-nav")
    var repoContent = document.getElementsByClassName("repository-content")
    var node = document.createElement('div')
    node.innerHTML = graph()
    content[0].insertBefore(node, repoContent[0])
    var myChart = echarts.init(document.getElementById('my-graph'))
    let option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        series: [
            {
                name:'Pull Request Interaction',
                type:'pie',
                radius: ['0%', '55%'],
                color: ['#e9def5', '#e9d8ff', '#d2beeb', '#bb9ee1', '#a37fd7', '#8a61cc', '#6f42c1'],
                data:[
                    {value:335, name:'Old Open without comment', label:createLabel('0')},
                    {value:310, name:'Refused without comment', label:createLabel('0.1')},
                    {value:234, name:'Open with old comment', label:createLabel('0.3')},
                    {value:135, name:'Refused with comment', label:createLabel('0.7')},
                    {value:1048, name:'Open with recent comment', label:createLabel('0.9')},
                    {value:251, name:'Merjed without comment', label:createLabel('0.9')},
                    {value:147, name:'Merjed with comment', label:createLabel('1')}
                ]
            }
        ]
    };
    myChart.setOption(option)
}

/**
 * Remove activity indicator element
 */
const stopActivityIndicator = () => {
    let loading_child = document.getElementById('loading');
    loading_child.parentNode.removeChild(loading_child);
}

/**
 * Create activity indicator element.
 * Adding the loading div inside the
 * created div is being added
 */
const insertActivityIndicator = () => {
    let myprogress = document.createElement('div')
    myprogress.innerHTML = loading()
    content[0].insertBefore(myprogress, repoContent[0])
}

/**
 * Create badges in initial Github page
 * @param {json} data
 */
const insertBadges = (data) => {
    metrics[0].active_indicator = data.active_indicator
    metrics[0].support_indicator = data.support_indicator
    metrics[0].welcoming_indicator = data.welcoming_indicator
    metrics[0].commit_graph.x_axis = data.commit_graph.x_axis
    metrics[0].commit_graph.y_axis = data.commit_graph.y_axis
    
    stopActivityIndicator()
    const node = document.createElement('div')
    node.innerHTML = badges()
    content[0].insertBefore(node, repoContent[0])
    createBadge("Active", data.active_indicator, 'my-badge')
    createBadge("Support", data.support_indicator, 'my-badge2')
    createBadge("Welcoming", data.welcoming_indicator, 'my-badge3')
}

/**
 * Create hubcare button in repository nav
 */
const insertButton = () => {
    let hubcareButton = document.createElement('div')
    hubcareButton.innerHTML = button()
    document.getElementsByClassName('reponav js-repo-nav js-sidenav-container-pjax container')[0]
        .appendChild(hubcareButton)
}

/**
 * Request metrics and indicators to hubcare api
 */
const requestMetrics = () => {
    const url = getApiUrl(repoName)
    return fetch(url)
        .then(response => response.json())
        .then(obj => insertBadges(obj[0]))
        .catch(error=>console.error(error))
}

/**
 * Stylize the HubCare button by clicking it leaving the same GitHub pattern
 */
const buttonOnClick = () => {
    $("#hubcare-button").on("click", function() {
        $(this).css("background", "#ffff");
        $(this).css("color", "#000000");
        $(this).css("border-left", "1px solid #e1e4e8");
        $(this).css("border-right", "1px solid #e1e4e8");
        $(this).css("border-top", "3px solid #4965d9");
        styleIcon();
        removeSelected();
    })
}

/**
 * Add Style to Hub Care Button Icon When Selected
 */
const styleIcon = () => {
    document.getElementById("path-icon").setAttribute("fill", "#000000")
}

/**
 * Removes the button that is selected along with the HubCare button
 */
const removeSelected = () =>{
    let a = document.getElementsByClassName("js-selected-navigation-item selected")[0]
    a.classList.remove("selected")
}

/**
 * Get access token to chrome storage and save in local variable
 */
const getAcessToken = () => {
    chrome.storage.sync.get('oauth2_token', function(res) {
        console.log('Settings retrieved', res.oauth2_token);
        if (res.oauth2_token != undefined){
            accessToken = res.oauth2_token;
            init();
        }
    });
}

/**
 * Init all plugin elements
 */
const init = () => {
    if(popup_key != false && accessToken != null){
        if(window.location.hash ==  '#hubcare'){
            hubcarePage()
        }
        insertActivityIndicator()
        insertButton()
        requestMetrics()
        buttonOnClick()
        document.getElementById('hubcare-button').addEventListener("click", function() {
            hubcarePage()
        }, false);
    }
}

/**
 * Init all plugin elements, but with no request
 */
const init_with_no_request = () => {
    if(popup_key != false && accessToken != null){
        if(window.location.hash ==  '#hubcare'){
            hubcarePage()
        }
        insertActivityIndicator()
        insertButton()
        insertBadges(metrics[0])
        buttonOnClick()

        document.getElementById('hubcare-button').addEventListener("click", function() {
            hubcarePage()
        }, false);
    }
}

const hubcarePage = () => {
    cleanPageContent()
    // createCommitChart()
    createPullRequestChart()
}

$(document).on('pjax:complete', () => {
    if(metrics[0].active_indicator == null){
        init()
    }
    else {
        init_with_no_request()
    }
})
