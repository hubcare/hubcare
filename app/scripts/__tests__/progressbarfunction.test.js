import progressbarfunction from '../progressbarfunction';

test('test the progress bar function', async () => {
    let teste_progressbarfunction = [
      '<style>',
      '	.progress-bar-function-{',
      '		height: 30px;',
      '		background-color: #fff;',
      '		display: flex;',
      '		border: 1px solid black;',
      '		border-radius: 5px;',
      '		margin-top: 3%;',
      '}',
      '	.progress-bar-function-::before{',
      '		content: "";',
      '		width: calc( * 1%);',
      '		background-color: #28a745;',
      '		border-bottom-left-radius: 5px;',
      '		border-top-left-radius: 5px;',
      '}',
      '	.question_tooltip {position: relative; display: inline-block;}',
        '	.question_tooltip .question_tooltiptext {visibility: hidden; width: 120px; background-color: #555; color: #fff; text-align: center;',
        '		border-radius: 6px; padding: 5px; padding-left: 3px; padding-right: 3px; position: absolute; z-index: 1; bottom: 200%; left: 50%;',
        '		margin-left: -100px; opacity: 0; transition: opacity 0.3s;}',
        '	.question_tooltip .question_tooltiptext::after {content: ""; position: absolute; top: 100%; left: 85%; margin-left: -5px;', 
        '		border-width: 5px; border-style: solid; border-color: #555 transparent transparent transparent; }',
        '	.question_tooltip:hover .question_tooltiptext {visibility: visible; opacity: 0.8;}',
      '</style>',

      '<div style="width:400px;"><h1 style="text-align: center;"></h1>',
      '	<div id="barfunction">',
      '		<div style="float: justify;">',
      '			<TABLE BORDER=0>',
      '				<TR>',
      '				<h1 id="text" style="text-align:left; font-size: 20px; display: inline;">',
      '				</h1>',
      '				<div style="display: inline;" id="question_mark" class="question_tooltip">',
        '					<img class="id_img_questionMark">',
        '					<span class="question_tooltiptext"></span>',
        '				</div>',
      '			</TR>',
      '			</TABLE>',
      '		</div>',
      '		<div style="float: left; margin-top:3%">',
      '			<TABLE BORDER=0>',
      '				<TR>',
      '					<TD id="partial" ALIGN=MIDDLE style= "font-size: 23px; padding-right: 15px">',
      '					</TD>',
      '				</TR>',
      '			</TABLE>',
      '		</div>',
      '		<div style="float: left">',
      '			<TABLE>',
      '				<TR>',
      '					<TD>',
      '						<TH id="full" ALIGN=RIGHT> </TH>',
      '					</TD>',
      '				</TR>',
      '			</TABLE>',
      '		</div>',
      '	</div>',
      '	<div class="progress-bar-function-" >',
      '	</div>',
      '</div>',
    ].join('');
    expect(progressbarfunction()).toBe(teste_progressbarfunction);
});