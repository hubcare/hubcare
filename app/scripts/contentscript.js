const $ = require('jquery');
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import graph from './graphs.js';
import badges from './badges.js';
import badge from 'project-badge/dist/badge.js';
import button from './button.js';
import loading from './loading.js';
import progressbarissue from './progressbarissue.js';
import progressbarfunction from './progressbarfunction.js'
import check_true from './check_true.js';
import check_false from './check_false.js';
import hubcare from './hubcare';
import activityPage from './activityPage';
import supportPage from './supportPage';
import checkTooltip from './checkTooltip';
import welcomingPage from './welcomingPage';

const allUrl = window.location.pathname.split('/');
const repoName = allUrl[1] + '/' + allUrl[2];
let accessToken = null;
let content = document.getElementsByClassName("new-discussion-timeline experiment-repo-nav");
let repoContent = document.getElementsByClassName("repository-content");
let metrics = null;
let popup_key = null;
let toolticText = {
    'release-note': '“Recent” mean a Release in the last 90 days',
    'license': 'The License must follows standart GitHub License file name',
    'readme': 'The README must follows standart GitHub Readme file name',
    'code-conduct': 'The Code of Conduct must follows standart GitHub file name for it',
    'issue-template': 'Issue Templates must be recognized bt GitHub as templates',
    'description': 'Description of this repository',
    'issue-activity-rate': 'An Active Issue is a Issue that got some activity in the last 15 days',
    'different-contributors': 'This measures how many contributors are giving a hand to this repo',
    'help-wanted': 'This measures the rate of issues labeled with “help wanted”',
    'good-first-issue': 'This measures the rate of issues labeled with “good first issue”',
    'contribution-guide': 'The Contribution Guide must follows the standart GitHub file name for it',
    'pull-request-template': 'The Pull Request Template must follows the standart GitHub file name for it',
    'pull-request-quality': 'This show how mainteners receive PRs on the repo',
    'commit-highs': 'Active repo should have at least some commits, do not you think?',
};

/**
 * Return url to hubcare api
 * @param {string} repoName 
 */
const getApiUrl = (repoName) =>
    `https://hubcare.ml/hubcare_indicators/${repoName}/${accessToken}/`;

/**
 * Create badge element
 * @param {string} text 
 * @param {value} progress 
 * @param {string} id 
 */
const createBadge = (text, progress, id) => {
    document.getElementById(id).getElementsByClassName('text1')[0].innerHTML = text;
    document.getElementById(id).getElementsByClassName('text2')[0].innerHTML = progress + '%';
    changeColorPercent(progress,text); 
}

/**
 * Remove repository content
 */
const removeContent = () => {
    let element = document.getElementsByClassName('repository-content ');
    if(element[0] != null){
        element[0].parentNode.removeChild(element[0]);
    }
}

/**
 * Remove DOM element by id
 * @param {string} id 
 */
const removeElementById = (id) => {
    let element = document.getElementById(id);
    if(element != null){
        element.parentNode.removeChild(element);
    }
}

/**
 * Return the badge color to progress value
 * @param {number} progress 
 */
const getBadgeColor = (progress) => {
    let badgeColor = "#cb2431";
    if(progress > 90){
        badgeColor = "#28a745";
    } else if(progress < 90 && progress > 80){
        badgeColor = "#4c9d3b";
    } else if(progress > 70 && progress <= 80){
        badgeColor = "#629534";
    } else if(progress > 60 && progress <= 70){
        badgeColor = "#7a902e";
    } else if(progress > 50 && progress <= 60){
        badgeColor = "#8f8727";
    } else if(progress > 40 && progress <= 50){
        badgeColor = "#be7c2a";
    } else if(progress > 30 && progress <= 40){
        badgeColor = "#d57631";
    } else if(progress > 20 && progress <= 30){
        badgeColor = "#f66a0a";
    } else if(progress > 10 && progress <= 20){
        badgeColor = "#e55136";
    } else if(progress <= 10){
        badgeColor = "#cb2431";
    }
    return badgeColor;
}

/**
 * Change badge color using the progress value
 * @param {number} progress 
 * @param {string} id 
 */
const changeColorPercent = (progress, id) => {
    if(id === 'Activity'){
        document.getElementById("percent-activity").style.backgroundColor = getBadgeColor(progress);
    } else if(id === 'Welcoming'){
        document.getElementById("percent-welcoming").style.backgroundColor = getBadgeColor(progress);
    } else if(id === 'Support'){
        document.getElementById("percent-support").style.backgroundColor = getBadgeColor(progress);
    }
}

/**
 * Remove all repository content elements in github
 */
const cleanPageContent = () => {
    removeContent();
    removeElementById('hubcare-page');
    removeElementById('my-badge');
    removeElementById('my-badge2');
    removeElementById('my-badge3');
}

/**
 * Create commit chart using metrics value
 * @param {string} element 
 */
const createCommitChart = (element) => {
    var content = document.getElementById(element)
    var node = document.createElement('div')
    node.innerHTML = graph()
    content.appendChild(node)
    var myChart = echarts.init(document.getElementById('my-graph'))
    var option = {
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            data: metrics.commit_graph.x_axis
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: metrics.commit_graph.y_axis,
            type: 'line'
            
        }]
    }
    myChart.setOption(option)
}

/**
 * Create latel to pull request interaction graph
 * @param {number} score 
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
                    fontSize: 14,
                    padding: 3
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
                    lineHeight: 22,
                    padding: 3
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
 * Remove all elements with zero value of list
 * @param {Array} data 
 */
const createChartData = (data) => {
    let arr = [
        {value:data[0], name:'Merged with comment', label:createLabel('1')},
        {value:data[1], name:'Merged without comment', label:createLabel('0.9')},
        {value:data[2], name:'Open with recent comment', label:createLabel('0.9')},
        {value:data[3], name:'Refused with comment', label:createLabel('0.7')},
        {value:data[4], name:'Open with old comment', label:createLabel('0.3')},
        {value:data[5], name:'Refused without comment', label:createLabel('0.1')},
        {value:data[6], name:'Old Open without comment', label:createLabel('0')}
    ];
    let newArr = [];
    for(let i = 0; i < 7 ; i++){
        if(parseFloat(data[i]) != 0){
            newArr.push(arr[i]);
        }
    }
    return newArr;
}

/**
 * Create pull request graph
 * @param {Array} data 
 * @param {string} element 
 */
const createPullRequestChart = (data, element) => {
    data = createChartData(data);
    var content = document.getElementById(element);
    var node = document.createElement('div');
    node.innerHTML = graph();
    content.appendChild(node);
    var myChart = echarts.init(document.getElementById('my-graph'));
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
                color: ['#6f42c1', '#8a61cc', '#a37fd7', '#bb9ee1', '#d2beeb', '#e9d8ff', '#e9def5'],
                data: data
            }
        ]
    };
    myChart.setOption(option);
}

/**
 * Create check model for the report element.
 * @param {string} text
 * @param {boolean} boolCheck 
 * @param {number} elementId 
 */
const createCheckModel = (text, boolCheck, elementId) => {
    let element = document.getElementById(elementId);
    let node = document.createElement('div')
    let tooltip = document.createElement('div');
    tooltip.innerHTML = checkTooltip(text, toolticText[elementId]);
    if(boolCheck == true){
        node.innerHTML = check_true()
        element.appendChild(tooltip) 
        element.appendChild(node)
    } else {
        node.innerHTML = check_false()
        element.appendChild(tooltip) 
        element.appendChild(node)
    }
}

/**
 * Create tooltip with questionMark Icon for the report element
 */
const addTooltipImages = () => {
    var myImage = chrome.extension.getURL("../images/questionMark.svg")
    let node = document.getElementsByClassName('id_img_questionMark');
    for (let i = 0; i < node.length; i++) {
        node[i].src = myImage;
    }
}

/**
 * Remove activity indicator element
 */
const stopActivityIndicator = () => {
    removeElementById('loading');
    removeElementById('text');
}

/**
 * Create activity indicator element.
 * Adding the loading div inside the
 * created div is being added
 */
const insertActivityIndicator = () => {
    let myprogress = document.createElement('div');
    myprogress.innerHTML = loading();
    content[0].insertBefore(myprogress, repoContent[0]);
}

/**
 * Create badges in initial Github page
 * @param {json} data
 */
const insertBadges = (data) => {
    metrics = data;
    
    stopActivityIndicator();
    if(window.location.hash == "#hubcare"){
        removeContent();
        hubcarePage();
    } else {
        const node = document.createElement('div');
        node.innerHTML = badges();
        content[0].insertBefore(node, repoContent[0]);
        createBadge("Activity", data.indicators.active_indicator, 'my-badge');
        createBadge("Support", data.indicators.support_indicator, 'my-badge2');
        createBadge("Welcoming", data.indicators.welcoming_indicator, 'my-badge3');
    }
}

/*
 * Creates the progress bar regarding issues
 */
const insertProgressBar = (activity, forgotten, element) => {
    //Calculate percentage bar
    let total = activity + forgotten;
    let activityPercent = (activity*100)/total;

    let issueprogressbar = document.createElement('div');
    issueprogressbar.innerHTML = progressbarissue(activity, forgotten, activityPercent, element);

    //Add div to the page main class 
    document.getElementById(element).appendChild(issueprogressbar)
}

/*
 * Create progress bar
 */
const ProgressBarFunction = (partial, full, text, element) => {
    //Calculate percentage bar
    let genericRate = (partial*100)/full;
    if(partial > full){
        genericRate = (full*100)/full;
    }
    let progressbar = document.createElement('div')
    progressbar.innerHTML = progressbarfunction(partial + " / " + full, text, genericRate, element, toolticText[element])

    //Add div to the page main class
    document.getElementById(element).appendChild(progressbar)
}

/**
 * Create hubcare button in repository nav
 */
const insertButton = () => {
    let hubcareButton = document.createElement('div')
    hubcareButton.innerHTML = button()
    document.getElementsByClassName('reponav js-repo-nav js-sidenav-container-pjax')[0]
        .appendChild(hubcareButton)
    document.getElementById('hubcare-button').addEventListener("click", function() {
        styleButton();
        if(metrics == null){
            removeContent();
        } else {
            cleanPageContent();
            hubcarePage();
        }
    }, false);
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
const styleButton = () => {
    let element = document.getElementById('hubcare-button');
    element.style = 'background: #ffff; color: #000000; border-left: 1px solid #e1e4e8; border-right: 1px solid #e1e4e8; border-top: 3px solid #4965d9'
    // Add Style to HubCare Button Icon When Selected
    document.getElementById("path-icon").setAttribute("fill", "#000000")
    removeSelected();
}

/**
 * Removes the button that is selected along with the HubCare button
 */
const removeSelected = () =>{
    let element = document.getElementsByClassName("js-selected-navigation-item selected")[0]
    if(element != null){
        element.classList.remove("selected")
    }
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
        insertButton()
        insertActivityIndicator()
        if(window.location.hash ==  '#hubcare'){
            if(metrics == null){
                requestMetrics();
                let element = document.getElementsByClassName('repository-content ');
                element[0].parentNode.removeChild(element[0]);
            } else {
                hubcarePage();
            }
            styleButton();
        } else if(metrics == null){
            requestMetrics()
        }
        else {
            insertBadges(metrics)
        }
    }
}

const createActivityPage = () =>{
    document.getElementById('hubcare-content').innerHTML = activityPage();
    ProgressBarFunction(metrics.commit_metric.commits_high_score, 10, "Commit to get a High Score", "commit-highs");
    ProgressBarFunction(metrics.commit_metric.differents_authors, 4,  "Number of Different Contributors to get a High Score", "different-contributors");
    insertProgressBar(metrics.issue_metric.active_issues,metrics.issue_metric.dead_issues,'issue-activity')
    ProgressBarFunction(parseFloat(metrics.issue_metric.activity_rate), parseFloat(metrics.issue_metric.activity_max_rate),  "Issue Activity Rate to get a High Score", "issue-activity-rate")
    createPullRequestChart(metrics.pull_request_graph.y_axis, 'pull-request-graph')
    ProgressBarFunction(parseFloat(metrics.pull_request_metric.acceptance_quality), 1, "PR Quality Score Mean to get a High Score", "pull-request-quality")
    createCheckModel('Recent Release Note', metrics.community_metric.release_note, 'release-note')
    createCommitChart("commit-graph")
    addTooltipImages();
}

const createSupportPage = () =>{
    document.getElementById('hubcare-content').innerHTML = supportPage();
    insertProgressBar(metrics.issue_metric.active_issues,metrics.issue_metric.dead_issues,'issue-activity');
    createCheckModel('Recent Release Note', metrics.community_metric.release_note, 'release-note')
    createCheckModel('Have a License', metrics.community_metric.license, 'license')
    createCheckModel('Have a README', metrics.community_metric.readme, 'readme')
    createCheckModel('Have a Code of Conduct', metrics.community_metric.code_of_conduct, 'code-conduct')
    createCheckModel('Have a Issue Template', metrics.community_metric.issue_template, 'issue-template')
    createCheckModel('Have a Description', metrics.community_metric.description, 'description')
    ProgressBarFunction(parseFloat(metrics.issue_metric.activity_rate), parseFloat(metrics.issue_metric.activity_max_rate),  "Issue Activity Rate to get a High Score", "issue-activity-rate")
    addTooltipImages();
}

const createWelcomingPage = () =>{
    document.getElementById('hubcare-content').innerHTML = welcomingPage();
    ProgressBarFunction(metrics.commit_metric.differents_authors, 4,  "Number of Different Contributors to get a High Score", "different-contributors");
    insertProgressBar(metrics.issue_metric.active_issues,metrics.issue_metric.dead_issues,'issue-activity');
    ProgressBarFunction(metrics.issue_metric.activity_rate, metrics.issue_metric.activity_max_rate,  "Issue Activity Rate to get a Hight Score", "issue-activity-rate");
    ProgressBarFunction(parseFloat(metrics.issue_metric.help_wanted_rate), parseFloat(metrics.issue_metric.help_wanted_max_rate), "Help-Wanted Issues Rate to get a High Score", "help-wanted")
    ProgressBarFunction(parseFloat(metrics.issue_metric.good_first_issue_rate), parseFloat(metrics.issue_metric.good_first_issue_max_rate), "Good-First-Issues Rate to get a High Score", "good-first-issue")
    createCheckModel('Recent Release Note', metrics.community_metric.release_note, 'release-note')
    createCheckModel('Have a License', metrics.community_metric.license, 'license')
    createCheckModel('Have a README', metrics.community_metric.readme, 'readme')
    createCheckModel('Have a Code of Conduct', metrics.community_metric.code_of_conduct, 'code-conduct')
    createCheckModel('Have a Issue Template', metrics.community_metric.issue_template, 'issue-template')
    createCheckModel('Have a Description', metrics.community_metric.description, 'description')
    createCheckModel('Have a Contribution Guide', metrics.community_metric.contribution_guide, 'contribution-guide')
    createCheckModel('Have a Pull Request Template', metrics.community_metric.pull_request_template, 'pull-request-template')
    createPullRequestChart(metrics.pull_request_graph.y_axis, 'pull-request-graph')
    ProgressBarFunction(parseFloat(metrics.pull_request_metric.acceptance_quality), 1, "PR Quality Score Mean to get a High Score", "pull-request-quality")
    addTooltipImages();
}

const hubcarePage = () => {
    var content = document.getElementsByClassName("new-discussion-timeline experiment-repo-nav")
    var repoContent = document.getElementsByClassName("repository-content")
    var node = document.createElement('div')
    node.innerHTML = hubcare()
    content[0].appendChild(node)
    createBadge("Activity", metrics.indicators.active_indicator, 'activity-badge')
    createBadge("Support", metrics.indicators.support_indicator, 'support-badge')
    createBadge("Welcoming", metrics.indicators.welcoming_indicator, 'welcoming-badge')
    let activeBadge = document.getElementById('my-badge');
    let supportBadge = document.getElementById('my-badge2');
    let welcomingBadge = document.getElementById('my-badge3');
    createActivityPage();
    activeBadge.style.cursor = "default";
    supportBadge.style.cursor = "pointer";
    welcomingBadge.style.cursor = "pointer";
    document.getElementById('my-badge').addEventListener("click", function() {
        activeBadge.style.backgroundColor = "#fff";
        activeBadge.style.borderBottom = "0px";
        activeBadge.style.borderBottomRightRadius = "0px";
        activeBadge.style.cursor = "default";
        
        supportBadge.style.backgroundColor = "#f6f8fa"
        supportBadge.style.borderBottom = "1px solid #d1d5da"
        supportBadge.style.borderBottomLeftRadius = "5px"
        supportBadge.style.borderBottomRightRadius = "0px"
        supportBadge.style.cursor = "pointer";
        
        welcomingBadge.style.backgroundColor = "#f6f8fa";
        welcomingBadge.style.borderBottom = "1px solid #d1d5da";
        welcomingBadge.style.borderBottomLeftRadius = "0px"
        welcomingBadge.style.cursor = "pointer";

        createActivityPage();

    }, false);
    document.getElementById('my-badge2').addEventListener("click", function() {
        activeBadge.style.backgroundColor = "#f6f8fa";
        activeBadge.style.borderBottom = "1px solid #d1d5da";
        activeBadge.style.borderBottomRightRadius = "5px";
        activeBadge.style.cursor = "pointer";
        
        supportBadge.style.backgroundColor = "#fff"
        supportBadge.style.borderBottom = "0px"
        supportBadge.style.borderBottomLeftRadius = "0px"
        supportBadge.style.borderBottomRightRadius = "0px"
        supportBadge.style.cursor = "default";
        
        welcomingBadge.style.backgroundColor = "#f6f8fa";
        welcomingBadge.style.borderBottom = "1px solid #d1d5da";
        welcomingBadge.style.borderBottomLeftRadius = "5px";
        welcomingBadge.style.cursor = "pointer";

        createSupportPage();
    }, false);
    document.getElementById('my-badge3').addEventListener("click", function() {
        activeBadge.style.backgroundColor = "#f6f8fa";
        activeBadge.style.borderBottom = "1px solid #d1d5da";
        activeBadge.style.borderBottomRightRadius = "0px";
        activeBadge.style.cursor = "pointer";
        
        supportBadge.style.backgroundColor = "#f6f8fa";
        supportBadge.style.borderBottom = "1px solid #d1d5da";
        supportBadge.style.borderBottomLeftRadius = "0px";
        supportBadge.style.borderBottomRightRadius = "5px";
        supportBadge.style.cursor = "pointer"
        
        welcomingBadge.style.backgroundColor = "#fff";
        welcomingBadge.style.borderBottom = "0px";
        welcomingBadge.style.borderBottomLeftRadius = "0px";
        welcomingBadge.style.cursor = "default";
        
        createWelcomingPage();
    }, false);
}

$(document).on('pjax:complete', () => {
    init()
})

chrome.storage.sync.get("active", function(res) {
    popup_key = res.active
    if(popup_key != false){
        getAcessToken()
    }
});
