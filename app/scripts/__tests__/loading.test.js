import loading from '../loading'

test('test loading function', async () => {
    let test_loading = [
        '<style>',
        '#loading{',
        '   position: absolute;',
        '   margin: 0 auto 3px;',
        '   text-align: center;',
        '}',
        '.loding-dots > div{',
        '   width: 8px;',
        '   height: 8px;',
        '   background-color: #6f42c1;',
        '   border-radius: 50%;',
        '   display: inline-block;',
        '   animation: 1.5s bounce infinite ease-in-out both;',
        '}',
        '.loding-dots .bounce{',
        '   animation-delay: -0.30s;',
        '}',
        '.loding-dots .bounce2{',
        '   animation-delay: -0.15s;',    
        '}',
        '@keyframes bounce {',
        '   0%,80%,100%{',
        '   transform: scale(0);',
        '   }',
        '   40%{',
        '       transform: scale(1);',
        '   }',
        '}',
        '.loding-dots .bounce3{',
        '}',
        '#text{ text-align: left; padding-left: 4%; color: #24292e; font-size: 14px;',
        'font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;}',
        '</style>',
        '<div id="loading">',
        '   <div class="loding-dots">',
        '       <div class="bounce"></div>',
        '       <div class="bounce2"></div>',
        '       <div class="bounce3"></div>',
        '   </div>',
        '</div>',
        '<div id="text">',
        '   <p>You were the first person to review this repository today! ',
        '       We&apos;re doing the math for you. It will take less than a minute.</p>',
        '</div>',
    ].join('');
    expect(loading()).toBe(test_loading);
});