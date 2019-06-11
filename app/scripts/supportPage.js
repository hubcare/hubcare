export default () => [
    '<style>',
    '.issue-activity{',
    '   text-align: center;',
    '   height:120px;',
    '   margin-left:30%;',
    '}',
    '.block{',
    '   border-top:1px solid #d1d5da;',
    '}',
    '.left-element{',
    '   height:180px;',
    '   width: 50%;',
    '   border-right:1px solid #d1d5da;',
    '   display: inline-block;',
    '   margin: -1px -1px 0;',
    '   padding: 8px;',
    '}',
    '.right-element{',
    '   height:180px;',
    '   width: 50%;',
    '   display: inline-block;',
    '   margin: -1px -1px 0;',
    '   padding: 8px;',
    '}',
    '</style>',
    '<div id="issue-activity" class="issue-activity"></div>',
    '<div id="issue-activity-rate" class="issue-activity"></div>',
    '<div class="block">',
    '   <div id="release-note" class="left-element"></div>',
    '   <div id="license" class="right-element"></div>',
    '</div>',
    '<div class="block">',
    '   <div id="readme" class="left-element"></div>',
    '   <div id="code-conduct" class="right-element"></div>',
    '</div>',
    '<div class="block">',
    '   <div id="issue-template" class="left-element"></div>',
    '   <div id="description" class="right-element"></div>',
    '</div>',
].join(''); 