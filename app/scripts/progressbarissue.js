export default (activity, forgotten, activityPercent, element) => [
    '<style>',
    '   .progress-bar-',element,'{',
    '       width: 400px;',
    '       height: 30px;',
    '       background-color: #cb2431;',
    '       display: flex;',
    '       border-style: solid;',
    '       border-color: black;',
    '       border-width: 1px;',
    '       border-radius: 5px;',
    '   }',
    '   .progress-bar-',element,'::before{',
    '       content: "";',
    '       width: calc(',activityPercent,' * 1%);',
    '       background-color: #28a745;',
    '   }',
    '</style>',

    '<div style="width:400px; height:75px;">',
    '   <h1 style="text-align: center;">Issues</h1>',
    '   <div id="bar">',
    '       <TABLE BORDER=0>',
    '           <TR>',
    '               <TD WIDTH=100 style="font-size: 18px">',
                        activity,
    '               </TD>',  
    '               <TD ALIGN=MIDDLE WIDTH=200 style= "font-size: 20px"> Activity X Forgotten</TD>',
    '               <TD id="forg"ALIGN=RIGHT WIDTH=100 style="font-size: 18px">',
                        forgotten,
    '               </TD>',
    '           </TR>',
    '       </TABLE>',
    '   </div>',
    '   <div class="progress-bar-',element,'" ></div>',
    '</div>',
].join(''); 