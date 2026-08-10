/* The markup the world expects to find.
 *
 * boot() reaches for about fifty element ids — the prompt, the arcade
 * overlay, the project modal, the HUD — with a plain querySelector, and every
 * one of them has to exist before it runs. This is that markup, carried over
 * verbatim from the single-file build.
 *
 * Kept as a string and injected rather than converted to JSX. It is a static
 * shell that React neither owns nor re-renders, and hand-converting a hundred
 * and twenty lines of it to className/htmlFor is a hundred and twenty chances
 * to introduce a typo that only shows up as a missing element at boot.
 */
export const SHELL_HTML = `<div id="scene"></div>
  <div id="fade"></div>

  <div id="hud">
    <div class="brand">
      <div class="tag">RJA · GAMEPLAY + FULLSTACK</div>
      <div class="name">Raúl Jiménez Ayza</div>
      <div class="role" data-i18n="role"></div>
    </div>
    <div class="hud-right">
      <button class="hbtn" id="helpBtn">?</button>
      <button class="hbtn" id="audioBtn" title="audio">♪</button>
      <button class="hbtn" id="langBtn">EN</button>
      <button class="hbtn" id="infoBtn" data-i18n="infoBtn"></button>
    </div>
  </div>

  <div id="legend">
    <div class="grp"><span class="key">W</span><span class="key">A</span><span class="key">S</span><span class="key">D</span><b data-i18n="legDrive"></b></div>
    <div class="grp"><span class="key">⇧</span><b data-i18n="legBoost"></b></div>
    <div class="grp"><span class="key">Space</span><b data-i18n="legBrake"></b></div>
    <div class="grp"><span class="key">E</span><b data-i18n="legOpen"></b></div>
    <div class="grp"><span class="key">G</span><b data-i18n="legPlay"></b></div>
    <div class="grp"><span class="key">H</span><b data-i18n="legHonk"></b></div>
    <div class="grp"><span class="key">R</span><b data-i18n="legReset"></b></div>
  </div>

  <div id="counters">
    <div class="box" id="speed"><b id="speedV">0</b> <span data-i18n="kmh">vel</span></div>
    <div class="box" id="fishHud"></div>
    <div class="box" id="zoneHud"></div>
  </div>
  <div id="toast"></div>

  <div id="prompt">
    <div class="k" data-i18n="promptK"></div>
    <div class="t" id="promptT"></div>
    <div class="l" id="promptL"></div>
    <div class="o" id="promptO"></div>
  </div>

  <div id="touch">
    <div class="pad" id="padL">
      <div class="tbtn up" data-k="w">▲</div><div class="tbtn lft" data-k="a">◀</div>
      <div class="tbtn dn" data-k="s">▼</div><div class="tbtn rgt" data-k="d">▶</div>
    </div>
    <div class="pad" id="padR">
      <div class="tbtn" data-k=" ">JUMP</div><div class="tbtn" data-k="e">OPEN</div>
      <div class="tbtn" data-k="shift">RUN</div><div class="tbtn" data-k="h">MEOW</div>
      <div class="tbtn" data-k="g">PLAY</div><div class="tbtn" data-k="r">RESET</div>
    </div>
  </div>

  <div id="intro">
    <div class="ring" id="introRing"></div>
    <div class="kick" data-i18n="introKick"></div>
    <h1 data-i18n="introTitle"></h1>
    <p data-i18n="introBody"></p>
    <div class="mini">
      <span data-i18n="miniDrive"></span><span data-i18n="miniOpen"></span><span data-i18n="miniFish"></span><span data-i18n="miniHonk"></span><span>🔊 con sonido</span>
    </div>
    <button id="startBtn" data-i18n="startBtn"></button>
    <div id="introErr"></div>
  </div>

  <div id="modal" class="ov">
    <div class="box">
      <div class="shot" id="mShot"><span>▚▚▚</span></div>
      <div class="mbody">
        <div class="k" id="mKind"></div>
        <h3 id="mTitle"></h3>
        <p class="b" id="mBody"></p>
        <div class="tags" id="mTags"></div>
        <div class="acts">
          <button id="mPlay" class="btn primary" style="display:none"></button>
          <a id="mLink" class="btn primary" target="_blank" rel="noopener"></a>
          <button id="mClose" class="btn ghost"></button>
        </div>
      </div>
    </div>
  </div>

  <div id="arc" class="ov">
    <div class="box"><div class="inner">
      <div class="num" id="arcKicker"></div>
      <h2 id="arcTitle"></h2>
      <p class="hint" id="arcHint"></p>
      <div class="screen">
        <canvas id="arcCanvas" width="480" height="330"></canvas>
        <div class="curtain" id="arcCurtain"><div><b id="arcCurtainT"></b><span id="arcCurtainB"></span></div></div>
      </div>
      <div class="scores">
        <span id="arcScoreL"></span>
        <span class="best" id="arcBestL"></span>
      </div>
      <div class="acts">
        <button class="btn primary" id="arcStart"></button>
        <button class="btn ghost" id="arcClose"></button>
      </div>
    </div></div>
  </div>

  <div id="mm" class="ov">
    <div class="box"><div class="inner">
      <div class="num" id="mmKicker"></div>
      <h2 id="mmTitle"></h2>
      <p class="hint" id="mmHint"></p>
      <div class="rows" id="mmRows"></div>
      <div class="palette" id="mmPalette"></div>
      <div class="acts">
        <button class="btn primary" id="mmCheck"></button>
        <button class="btn ghost" id="mmClear"></button>
        <button class="btn ghost" id="mmClose"></button>
        <span class="status" id="mmStatus"></span>
      </div>
      <div class="done" id="mmDone"><b id="mmDoneT"></b><p id="mmDoneB"></p></div>
    </div></div>
  </div>

  <div id="info" class="ov">
    <div class="box">
      <button class="btn ghost close" id="infoClose"></button>
      <div class="inner" id="infoInner"></div>
    </div>
  </div>`;
