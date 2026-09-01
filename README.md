# 💰 Finanční Tracker

Jednoduché a přehledné webové řešení pro sledování vašich výdajů a příjmů. Aplikace vám pomáhá udržet si přehled o penězích s intuitivním rozhraním a okamžitými statistikami.

## ✨ Co můžete dělat v aplikaci

### 📊 Správa Financí
- **Přidávání položek** – Jednoduše zaznamenávejte své výdaje a příjmy s datem, časem, popisem a částkou
- **Kategorizace výdajů** – Sledování výdajů podle kategorií (Doprava, Elektronika, Hry, Nákupy, Online nákupy, Palivo, Předplatné, Restaurace & Fast Food, Tabák)
- **Kategorizace příjmů** – Oddělené kategorie pro Pravidelný příjem, Nepravidelný příjem a Počáteční zůstatek
- **Úpravy a mazání** – Můžete upravit nebo smazat jakoukoliv zadanou položku

### 📈 Přehled Výdajů dle Kategorií
- **Výdaje podle kategorií** – Grafické znázornění toho, kam jdou vaše peníze s podrobným přehledem celkových výdajů v každé kategorii
- **Seřazeno podle velikosti** – Kategorie jsou automaticky seřazeny od nejvyšších výdajů po nejnižší, takže snadno vidíte, kde utratíte nejvíce

### 💰 Přehled Příjmů dle Kategorií
- **Příjmy podle kategorií** – Přehled všech vašich příjmů rozdělených na Pravidelný příjem a Nepravidelný příjem
- **Sledování příjmů** – Jasné rozlišení mezi pravidelným příjmem (např. plat) a mimořádnými příjmy (dary, bonusy, atd.)
- **Počáteční zůstatek měsíce** – Pro každý měsíc můžete nastavit výchozí stav peněz, od kterého se počítá aktuální zůstatek

### 📋 Seznamy a Přehledy
- **Přehled zůstatku** – Zobrazení počátečního zůstatku, celkových příjmů, výdajů a aktuálního stavu na konci měsíce
- **Detailní seznam všech položek** – Kompletní tabulka se všemi zadanými transakcemi, jejich typem, časem a částkou
- **Běžící zůstatek** – U každé položky vidíte průběžný zůstatek peněz
- **Snadné vyhledávání** – Procházejte jednotlivými měsíci a sledujte, jak se vaše finance vyvíjejí

### 🌓 Tmavý režim
- **Světlý/Tmavý režim** – Přepínání mezi barevnými schématy dle preferencí a času dne
- **Paměť preferencí** – Zvolený motiv se pamatuje, i když zavřete aplikaci

### 💾 Práce s Daty
- **Export dat** – Stáhněte si všechna vaše data ve formátu JSON pro zálohování nebo přesun na jiný počítač
- **Import dat** – Načtěte si dříve exportovaná data a pokračujte v práci
- **Automatické ukládání** – Veškerá data se automaticky ukládají v prohlížeči (Local Storage) bez nutnosti ručního ukládání

### 🗓️ Navigace po Měsících
- **Přecházení mezi měsíci** – Snadné přecházení mezi jednotlivými měsíci pro lepší organizaci a analýzu výdajů v čase
- **Měsíční přehledy** – Každý měsíc má své vlastní údaje, takže můžete porovnávat výdaje mezi jednotlivými měsíci

## 🚀 Začínáme

1. Navštivte: https://mathiastichota2006-spec.github.io/finance-tracker/
2. (Volitelně) nastavte **Počáteční zůstatek** jako první položku měsíce
3. Začněte přidávat vaše výdaje a příjmy
4. Sledujte svůj přehled v reálném čase
5. Exportujte si data pro zálohování, když chcete

## 📝 Jak Používat

### Nastavení Počátečního Zůstatku
1. Otevřete měsíc, pro který chcete nastavit výchozí stav.
2. V sekci **Přidat položku** vyplňte datum, čas a částku.
3. Do pole **Popis** napište například „Počáteční zůstatek".
4. V poli **Typ** vyberte **Počáteční zůstatek**.
5. Klikněte na **Přidat**.

> Poznámka: V každém měsíci je aktivní pouze poslední zadaný počáteční zůstatek.

### Přidání Nové Položky
1. Klikněte na sekci "Přidat položku"
2. Vyplňte:
   - **Datum** – Den transakce
   - **Čas** – Čas transakce
   - **Popis** – Co byl výdaj/příjem
   - **Typ** – Vyberte kategorii (např. Doprava, Elektronika, Pravidelný příjem)
   - **Částka** – Kolik Kč
3. Klikněte "Přidat"

### Sledování Statistik
- Sekce "Přehled" ukazuje vaši aktuální finanční situaci
- Sekce "Výdaje podle kategorií" vizualizuje, jak se vaše peníze dělí mezi jednotlivé kategorie
- Sekce "Příjmy podle kategorií" ukazuje vaše příjmy rozdělené podle typu
- Všechny položky jsou zobrazeny v tabulce "Položky" s běžícím zůstatkem

### Úprava a Mazání
- Klikněte na tlačítko "Upravit" u libovolné položky a změňte její údaje
- Klikněte na tlačítko "Smazat" pro odstranění položky
- Můžete také přesunout položku na jiný den

### Export a Import
- Klikněte na tlačítko "💾 Export" pro stažení všech dat
- Klikněte na tlačítko "📂 Import" a vyberte dříve exportovaný JSON soubor
- Data se budou promptem aktualizovat na importovaná

#### Import Počátečního Zůstatku přes JSON
Pokud chcete přenést počáteční zůstatek mezi zařízeními:
- nastavte v aplikaci položku typu **Počáteční zůstatek**,
- proveďte standardní export,
- na druhém zařízení proveďte standardní import.

Po importu se počáteční zůstatek načte automaticky pro příslušný měsíc.

## 📋 Podporované Kategorie

### Výdaje
- 🚗 Doprava
- 💻 Elektronika
- 🎮 Hry
- 🛍️ Nákupy
- 📦 Online nákupy
- ⛽ Palivo
- 🎬 Předplatné
- 🍽️ Restaurace & Fast Food
- 🚬 Tabák

### Příjmy
- 💰 Pravidelný příjem (plat, stipendium, atd.)
- 💸 Nepravidelný příjem (dary, bonusy, atd.)
- 🧾 Počáteční zůstatek (výchozí stav měsíce)

## 📜 Licence – AGPLv3

Tato aplikace je licencována pod **GNU Affero General Public License v3.0 (AGPLv3)**. 

### Co to znamená pro vás?

Jednoduše řečeno – aplikace je zcela **svobodná a otevřená**:

- ✅ **Můžete ji používat zdarma** – Bez nutnosti objednat si, zaregistrovat se nebo cokoliv za to zaplatit
- ✅ **Můžete si ji stáhnout** – Máte přístup k celému zdrojovému kódu
- ✅ **Můžete ji modifikovat** – Chcete-li změnit, jak funguje, můžete ji upravit pro své potřeby
- ✅ **Můžete ji šířit** – Můžete ji sdílet s přáteli, na internetu nebo kamkoli jinde

### Omezení (pro vývojáře)

Pokud chcete upravit kód a spustit jej jako online službu pro ostatní:
- Musíte zdrojový kód zveřejnit
- Musíte ponechat stejnou licenci (AGPLv3)
- Vaši uživatelé musí mít přístup ke kódu

**Pro běžné uživatele** to znamená jednoduše: aplikace je zcela svobodná, vaše data jsou pouze vaše, a nikdo vás nekontroluje.

## 🛠️ Technologie

- **HTML5** – Struktura aplikace
- **CSS3** – Moderní design a responzivní layout
- **JavaScript** – Logika aplikace a správa dat
- **Local Storage API** – Ukládání dat v prohlížeči

## 💡 Tipy na Použití

- Pravidelně přidávejte položky pro lepší přehled
- Používejte podrobný popis k detailnímu zaznamenání (např. "Benzín Benzina ABC" místo jen "Palivo")
- Přepínejte mezi měsíci pro analýzu výdajů v čase
- Všechna data se uchovávají automaticky, není potřeba ručně ukládat
- Exportujte si data jednou měsíčně jako zálohu

## 📱 Kompatibilita

Aplikace je plně funkční na:
- ✅ Desktop prohlížečích (Chrome, Firefox, Safari, Edge)
- ✅ Mobilních zařízeních
- ✅ Offline režim (po stáhnutí lze spustit přímo z počítače)

## ⚠️ Důležité Poznámky

- **Data se ukládají lokálně** – Veškerá data zůstávají pouze v Local Storage vašeho prohlížeče. Nikam se neodesílají.
- **Bezpečnost** – Aplikace neodesílá žádné informace na internet. Všechno probíhá v prohlížeči.
- **Vymazání cookies/cache** – Vymazání cookies nebo cache prohlížeče smaže i vaše data, proto si pravidelně exportujte
- **Backup** – Pro ochranu vašich dat si vezměte screenshot nebo používejte export funkci

## 📞 Podpora a Zpětná Vazba

Máte nápad na zlepšení? Chcete nahlásit problém? Navštivte Issues v repozitáři.
