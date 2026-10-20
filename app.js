(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };

  /* ---------- data (ceník z datamedic.cz) ---------- */
  var P = {
    hdd: {
      fs:     [[500, 4000], [1000, 5000], [1500, 6000]],
      el:     [[1000, 6000], [2000, 8000], [3000, 9000]],
      surf:   [[2000, 7000], [3000, 9000], [3000, 11000]],
      heads:  [[3000, 10000], [4000, 12000], [6000, 15000]]
    },
    flash: {
      fs: [[400, 2000], [500, 2500], [600, 3000]],
      el: [[600, 5000], [800, 7000], [1000, 9000]]
    },
    card: {
      fs: [[400, 1600], [500, 2000], [600, 2500]],
      el: [[800, 5000], [1000, 7000], [1200, 9000]]
    },
    opt: {
      fs:  [[500, 2000], [500, 3000], [1500, 5000]],
      unr: [[500, 3000], [800, 4000], [1200, 6000]]
    }
  };

  var NOW_DEFAULT = 'Médium nezapojujte a nic nezkoušejte opravovat.';

  var MEDIA = [
    {
      id: 'hdd', name: 'Pevný disk',
      caps: { '3,5″': ['do 120 GB', '160–500 GB', '640 GB–2 TB'], '2,5″': ['do 60 GB', '80–200 GB', '250–500 GB'] },
      sym: [
        { t: 'Disk se neroztočí', d: ['el'], c: 'Poškozená elektronika nebo firmware, motor či zadřená ložiska.', n: 'Počítač vypněte. Disk neotvírejte ani se ho nesnažte opravit.' },
        { t: 'Cvaká nebo vydává pravidelné zvuky', d: ['heads'], c: 'Poškozené nebo utržené čtecí hlavy, případně servisní oblast.', n: 'Počítač ihned vypněte. Každé další spuštění může škodu zvětšit.' },
        { t: 'Točí se, ale počítač ho nevidí', d: ['el', 'surf'], c: 'Elektronika, servisní oblast, hlavy nebo povrch plotének.', n: 'Počítač vypněte a disk nechte být.' },
        { t: 'Nenabíhá systém', d: ['fs'], c: 'Poškozený souborový systém nebo operační systém.', n: 'Na disk nic neinstalujte a nic na něj nezapisujte.' },
        { t: 'Některé soubory nejdou přečíst', d: ['fs', 'surf'], c: 'Poškozený souborový systém nebo povrch plotének.', n: 'Nekopírujte dál. Nečitelná místa se s každým pokusem zhoršují.' },
        { t: 'Smazal(a) jsem data nebo formátoval(a)', d: ['fs'], c: 'Smazaná data stále existují, jen je systém bere jako volné místo. Šance klesá s každým zápisem.', n: 'Nic na disk nezapisujte. Počítač vypněte odpojením ze sítě, běžné vypnutí zapisuje data.' }
      ]
    },
    {
      id: 'raid', name: 'RAID / NAS', nocap: true,
      sym: [
        { t: 'Vypadl disk, rebuild selhal', c: 'Chyba při obnově po přidání disku nebo druhý vadný disk v poli.', n: 'Pole nespouštějte znovu a nic nepřestavujte. Nechte disky v původním pořadí.' },
        { t: 'Selhal řadič', c: 'Porucha RAID řadiče nebo NAS. Data na discích zpravidla zůstávají.', n: 'Disky nepřehazujte a nezapojujte do jiného zařízení.' },
        { t: 'Neznámá nebo chybějící konfigurace', c: 'Konfiguraci pole umíme dohledat i bez znalosti původního nastavení.', n: 'Nic neinicializujte. Zapište si, co o poli víte.' }
      ],
      price: 'Individuálně', priceNote: 'Podle počtu disků, konfigurace a rozsahu poškození. Odhad po diagnostice zdarma.'
    },
    {
      id: 'flash', name: 'Flash disk', capLabels: ['do 2 GB', '4–16 GB', '32–128 GB'],
      sym: [
        { t: 'Počítač ho nevidí', d: ['el'], c: 'Poškozená elektronika nebo konektor.', n: NOW_DEFAULT },
        { t: 'Hlásí chybu nebo chce formátovat', d: ['fs'], c: 'Poškozený souborový systém. Data bývají v pořádku.', n: 'Neformátujte. Formátování přepisuje data.' },
        { t: 'Soubory jsou pryč', d: ['fs'], c: 'Smazaná data lze zpravidla vrátit, dokud nejsou přepsána.', n: 'Nic na flash disk nekopírujte.' }
      ]
    },
    {
      id: 'card', name: 'Paměťová karta', capLabels: ['do 1 GB', '2–8 GB', '16–64 GB'],
      sym: [
        { t: 'Fotoaparát nebo čtečka ji nevidí', d: ['el'], c: 'Poškozená elektronika nebo kontakty.', n: 'Kartu už nevkládejte do přístrojů, nefoťte na ni.' },
        { t: 'Hlásí chybu nebo chce formátovat', d: ['fs'], c: 'Poškozený souborový systém. Snímky bývají v pořádku.', n: 'Neformátujte. Formátování přepisuje data.' },
        { t: 'Smazané fotky nebo videa', d: ['fs'], c: 'Smazané soubory lze zpravidla vrátit, dokud na kartu nic nezapíšete.', n: 'Přestaňte kartu používat.' }
      ]
    },
    {
      id: 'opt', name: 'CD / DVD / Blu-ray', capLabels: ['CD', 'DVD', 'Blu-ray'],
      sym: [
        { t: 'Nečte se, je poškrábané', d: ['unr'], c: 'Poškrábaný povrch nebo vadné médium.', n: 'Disk nečistěte brusnými prostředky a nezkoušejte ho dokola.' },
        { t: 'Špatně vypálené nebo zestárlé', d: ['unr'], c: 'Stárnutí záznamové vrstvy nebo chyba při vypalování.', n: 'Uložte ho do obalu mimo světlo a teplo.' },
        { t: 'Hlásí chybu, je prázdné', d: ['fs'], c: 'Poškozený souborový systém disku.', n: NOW_DEFAULT }
      ]
    },
    {
      id: 'other', name: 'Něco jiného', nocap: true,
      sym: [
        { t: 'Jiný nebo vzácný nosič', c: 'Zabýváme se i méně běžnými médii. Stačí zavolat a popsat.', n: NOW_DEFAULT }
      ],
      price: 'Individuálně', priceNote: 'Odhad po diagnostice zdarma.'
    }
  ];

  var TEMPO = [
    { l: 'Nespěchám', f: 0.75, s: '−25 %' },
    { l: 'Běžně', f: 1, s: '' },
    { l: 'Do 22:00', f: 1.5, s: '+50 %' },
    { l: 'Non-stop', f: 2, s: '+100 %' }
  ];

  var st = { m: 0, s: -1, ff: '3,5″', cap: 1, tempo: 1 };

  var elMedia = $('#media'), elSym = $('#sym'), elOut = $('#out');

  var kc = function (n) { return Math.round(n / 10) * 10; };
  var fmt = function (n) { return kc(n).toLocaleString('cs-CZ').replace(/\s/g, ' '); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  function renderMedia() {
    elMedia.innerHTML = MEDIA.map(function (m, i) {
      return '<li><button type="button" role="option" aria-selected="' + (i === st.m) + '" data-i="' + i + '">' + esc(m.name) + '</button></li>';
    }).join('');
  }

  function renderSym() {
    var m = MEDIA[st.m];
    elSym.innerHTML = m.sym.map(function (s, i) {
      return '<li><button type="button" role="option" aria-selected="' + (i === st.s) + '" data-i="' + i + '">' + esc(s.t) + '</button></li>';
    }).join('');
  }

  function range(m, s) {
    var tbl = P[m.id];
    var lo = Infinity, hi = 0;
    s.d.forEach(function (k) {
      var r = tbl[k][st.cap];
      lo = Math.min(lo, r[0]); hi = Math.max(hi, r[1]);
    });
    var f = TEMPO[st.tempo].f;
    return [lo * f, hi * f];
  }

  function chips(items, active, attr) {
    return items.map(function (l, i) {
      return '<button type="button" ' + attr + '="' + i + '" aria-pressed="' + (i === active) + '">' + esc(l) + '</button>';
    }).join('');
  }

  function renderOut() {
    if (st.s < 0) {
      elOut.className = 'col col--out is-idle';
      elOut.innerHTML =
        '<p class="idle__q">Vyberte příznak a hned uvidíte, co dál a kolik to bude stát.</p>' +
        '<div class="idle__call"><span>Nebo rovnou zavolejte</span><a href="tel:+420774633420">774 633 420</a><small>nonstop</small></div>';
      return;
    }
    var m = MEDIA[st.m], s = m.sym[st.s];
    var price, note, ctrl = '';

    if (m.price) {
      price = m.price; note = m.priceNote;
    } else {
      var r = range(m, s);
      price = fmt(r[0]) + ' – ' + fmt(r[1]) + ' Kč';
      note = 'Bez DPH. Přesná cena po diagnostice, která je zdarma. Při neúspěchu bez poplatku za materiál.';
      var capLabels = m.caps ? m.caps[st.ff] : m.capLabels;
      if (m.caps) {
        ctrl += '<div class="seg seg--ff">' + Object.keys(m.caps).map(function (k) {
          return '<button type="button" data-ff="' + k + '" aria-pressed="' + (k === st.ff) + '">' + k + '</button>';
        }).join('') + '</div>';
      }
      ctrl += '<div class="seg">' + chips(capLabels, st.cap, 'data-cap') + '</div>';
      ctrl += '<div class="seg seg--tempo">' + TEMPO.map(function (t, i) {
        return '<button type="button" data-tempo="' + i + '" aria-pressed="' + (i === st.tempo) + '">' + t.l + (t.s ? '<em>' + t.s + '</em>' : '') + '</button>';
      }).join('') + '</div>';
    }

    var body = 'Nosič: ' + m.name + '\nPříznak: ' + s.t +
      (m.price ? '' : '\nKapacita: ' + (m.caps ? st.ff + ', ' : '') + (m.caps ? m.caps[st.ff][st.cap] : m.capLabels[st.cap])) +
      '\n\nModel / popis problému:\n';
    var mail = 'mailto:info@datamedic.cz?subject=' + encodeURIComponent('Záchrana dat – ' + m.name) + '&body=' + encodeURIComponent(body);

    elOut.className = 'col col--out';
    elOut.innerHTML =
      '<div class="res">' +
        '<p class="res__cause">' + esc(s.c) + '</p>' +
        '<p class="res__now"><b>Teď:</b> ' + esc(s.n) + '</p>' +
        '<div class="res__price"><strong>' + price + '</strong><small>' + esc(note) + '</small></div>' +
        ctrl +
      '</div>' +
      '<div class="res__cta">' +
        '<a class="btn btn--red" href="tel:+420774633420">Zavolat 774 633 420</a>' +
        '<a class="btn" href="' + mail + '">Napsat</a>' +
      '</div>';
  }

  elMedia.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    st.m = +b.dataset.i; st.s = -1; st.cap = 1;
    if (MEDIA[st.m].sym.length === 1) st.s = 0;
    renderMedia(); renderSym(); renderOut();
  });
  elSym.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    st.s = +b.dataset.i; renderSym(); renderOut();
    if (window.matchMedia('(max-width:900px)').matches) elOut.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  elOut.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.ff) { st.ff = b.dataset.ff; }
    if (b.dataset.cap) { st.cap = +b.dataset.cap; }
    if (b.dataset.tempo) { st.tempo = +b.dataset.tempo; }
    renderOut();
  });

  renderMedia(); renderSym(); renderOut();

  /* ---------- otevřeno / zavřeno ---------- */
  function status() {
    var p = new Intl.DateTimeFormat('cs-CZ', { timeZone: 'Europe/Prague', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    var get = function (t) { return (p.filter(function (x) { return x.type === t; })[0] || {}).value; };
    var wd = ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'].indexOf(get('weekday').toLowerCase().replace('.', ''));
    var mins = (+get('hour') % 24) * 60 + (+get('minute'));
    var open = wd >= 1 && wd <= 5 && ((mins >= 540 && mins < 720) || (mins >= 780 && mins < 1020));
    var el = $('#status');
    el.classList.toggle('is-open', open);
    $('span', el).textContent = open
      ? 'Právě otevřeno · ' + (mins < 720 ? 'do 12:00' : 'do 17:00')
      : 'Zavřeno · hotline běží nonstop';
  }
  status();

  /* ---------- sledování zakázky ---------- */
  var track = $('#track'), tt = $('.track-toggle');
  track.addEventListener('submit', function (e) {
    e.preventDefault();
    $('.track__msg', track).hidden = false;
  });
  tt.addEventListener('click', function () {
    var o = track.classList.toggle('is-open');
    tt.setAttribute('aria-expanded', o);
  });

  /* ---------- navbar ---------- */
  var bar = $('#bar');
  var onScroll = function () { bar.classList.toggle('is-solid', window.scrollY > 20); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- ceník ---------- */
  var tabs = document.querySelectorAll('.tabs button');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === b); });
      document.querySelectorAll('.pane').forEach(function (p) { p.hidden = p.dataset.pane !== b.dataset.t; });
    });
  });
})();
