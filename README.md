# Trdna Skala — spletna stran in urejevalnik

Ohranjena je enostranska zasnova z Jer 33,3 in jasnim videom. Meni Dogodki vodi do prihajajočih dogodkov (Crikvenica 2027, moška skupina) ter arhiva napovednikov (2026, 2023). Dodajaš lahko poljubne druge dogodke.

Windows urejevalnik: v nadrejeni mapi outputs zaženi UREDI-TRDNO-SKALO.cmd. Celotna navodila sta v NAVODILA-UREJEVALNIK.md in NAVODILA-GITHUB-IN-DOMENA.md. Samostojni program in njegova izvorna koda sta v sosednji mapi TrdnaSkala-Urejevalnik.

Vsebina: vsebina.js. Predloge in opis polj: .cms/predloge in .cms/polja.json. Program ob shranjevanju ponovno izdela index.html in styles.css ter shrani varnostno kopijo v .cms/varnostne-kopije. Ročne spremembe končnega HTML/CSS se ob naslednjem shranjevanju prepišejo.

Preverjeno: prevod programa brez opozoril; zagon samostojnega Windows programa; urejanje in shranjevanje besedila v vmesniku; polja dogodka; 11 integracijskih preverjanj izvoza, menijev, medijev, barv, varnostnih kopij in zavrnitve neveljavnih podatkov. Prikaz prihajajočih dogodkov je bil preverjen v brskalniku. Dodatno upravljanje računalnika je uporabnik ustavil s tipko Escape.

Stran še ni objavljena na GitHubu. Račun, repozitorij in DNS se nastavijo po priloženih navodilih. Program ne hrani prijavnih gesel in ne izvaja samodejne objave.

Posodobitev: naslovnica ima kompakten zgornji naslovni pas in nastavljiv položaj (devet položajev), velikost za računalnik/telefon ter prosojnost. Vsebina je v vsebina.js → naslovnica. Uporabnikov nazadnje izbrani video in njegove druge spremembe so ohranjeni. Novi program: Program-v2; zagon prek iste datoteke UREDI-TRDNO-SKALO.cmd.
