/**
 * Seed script: Barcha 12 ta zodiak belgisi uchun kundalik goroskop namunalarini bazaga kiritadi.
 * Ishlatish: node seed_horoscope.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Horoscope = require('./models/Horoscope');

const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

const horoscopeData = [
    {
        sign: 'aries', type: 'daily', date: today,
        predictions: {
            general: 'Segodnya den polny energii i novyx vozmozhnostey. Deystvuyte reshitelno.',
            love: 'Romanticheskoe nastroenie sposobstvuet sblizheniyu. Udelite vremya partnyoru.',
            career: 'Vasha iniciativa budet otmechena rukovodstvom. Horoshy den dlya novyx proektov.',
            health: 'Fizicheskaya aktivnost prinesyot polzu. Ne pereuserdstvuyte.'
        },
        luckyNumber: 9, luckyColor: 'Krasny', compatibility: ['leo', 'sagittarius']
    },
    {
        sign: 'taurus', type: 'daily', date: today,
        predictions: {
            general: 'Stabilnost i komfort — vashi klyuchevye slova segodnya. Doveryayte intuicii.',
            love: 'Provedite vremya s blizkimi. Prostoe obshenie ukrepit otnosheniya.',
            career: 'Finansovye dela idet v goru. Horoshiy den dlya investiciy.',
            health: 'Otdyx tak zhe vazhen, kak i trud. Sbalansiruyte svoy den.'
        },
        luckyNumber: 6, luckyColor: 'Zelyony', compatibility: ['virgo', 'capricorn']
    },
    {
        sign: 'gemini', type: 'daily', date: today,
        predictions: {
            general: 'Vash um ostr i gotov k novym ideyam. Obshenie prinesyot udachu.',
            love: 'Otkroytesь partnyoru — on gotov vyslushat. Iskrennost ukrepit svyaz.',
            career: 'Setevye kontakty i peregovory prinesut plody. Aktivno vzaimodeystvuyte.',
            health: 'Nervnaya sistema trebuet vnimaniia. Medituiruyte ili proguljaytesь.'
        },
        luckyNumber: 5, luckyColor: 'Zhyolty', compatibility: ['libra', 'aquarius']
    },
    {
        sign: 'cancer', type: 'daily', date: today,
        predictions: {
            general: 'Segment emotsionalnogo vosstanovleniya. Doma budet osobenno uyutno.',
            love: 'Lyubov i zashchita — vashi silny storony segodnya. Duzin zaboty.',
            career: 'Rabota v komande prinesyot luchshie rezultaty, chem solo.',
            health: 'Pozvoltye sebe rasslabitsya. Teplaya vanna ili chai — to, chto nuzhno.'
        },
        luckyNumber: 2, luckyColor: 'Belyy', compatibility: ['scorpio', 'pisces']
    },
    {
        sign: 'leo', type: 'daily', date: today,
        predictions: {
            general: 'Vasha xarizmatichnost na pike. Lyudi tyanutsya k vam — ispolzuyte eto.',
            love: 'Vspyshka strasti vozmozhna segodnya. Budte reshitelny v chuvstvakh.',
            career: 'Rukovodstvo i prezentacii — vasha sfera. Goryachiy den dlya liderov.',
            health: 'Energii mnogo — napravtye ee v sport ili tvorchestvo.'
        },
        luckyNumber: 1, luckyColor: 'Zolotyy', compatibility: ['aries', 'sagittarius']
    },
    {
        sign: 'virgo', type: 'daily', date: today,
        predictions: {
            general: 'Analiticheskoe myshlenie — vash klyuch k uspehu segodnya. Budte tochny.',
            love: 'Pokazhite svoi zabotu cherez postupki, a ne slova. Eto budet oceneno.',
            career: 'Poryadok i planirovanie prinesut otlichnye result. Uluchshite processive.',
            health: 'Pravilnoe pitanie i rezhim — osnova blagopoluchiya. Ne ignoriruyte telo.'
        },
        luckyNumber: 3, luckyColor: 'Bejzhevyy', compatibility: ['taurus', 'capricorn']
    },
    {
        sign: 'libra', type: 'daily', date: today,
        predictions: {
            general: 'Garmoniya vo vsem — vash ideal. Segodnya idealno dlya primireny i dogovorov.',
            love: 'Romantika v vozdukhe. Priglashenie na svidanie ili nezhny zhest budet kstati.',
            career: 'Diplomaticheskiy podkhod reshet spory. Vash talant peregovorshchika raskroetsya.',
            health: 'Umerennost vo vsem. Ne pererabotyvayte, delajte pauzy.'
        },
        luckyNumber: 7, luckyColor: 'Rozovyy', compatibility: ['gemini', 'aquarius']
    },
    {
        sign: 'scorpio', type: 'daily', date: today,
        predictions: {
            general: 'Glubokiye prozreniya i transformacii — vash put segodnya. Dovertes instinktu.',
            love: 'Strastnye otnosheniya dostigajut novogo urovnja. Budte otkryty.',
            career: 'Skrytye vozmozhnosti budut raskryty. Issleduyte i kopajte glubzhe.',
            health: 'Psikhologicheskoe zdorove vazhnee fizicheskogo. Pogovorite s ktem-to blizkym.'
        },
        luckyNumber: 8, luckyColor: 'Bordovyy', compatibility: ['cancer', 'pisces']
    },
    {
        sign: 'sagittarius', type: 'daily', date: today,
        predictions: {
            general: 'Priklyucheniya i otkrytiya zhdat vas za uglom. Budte gotovy k neozhidannomu.',
            love: 'Svoboda i priklucheniya privlekayut vas. Predlozhite partneru chto-to novoe.',
            career: 'Krativnost i optizm privlekut udachu. Den dlya boldyyx idej.',
            health: 'Priroda i svezhiy vozdukh — vash lekar segodnya. Vyjdite na progulku.'
        },
        luckyNumber: 4, luckyColor: 'Siniy', compatibility: ['aries', 'leo']
    },
    {
        sign: 'capricorn', type: 'daily', date: today,
        predictions: {
            general: 'Trud i upornstvo — vashi luchshiye druzya. Dvizhenie k celi uskorilось.',
            love: 'Stabitelnye otnosheniya prinosyat udovletvorenie. Tsente to. chto est.',
            career: 'Dlitelnoе planirovanie daet plody. Rukovodstvo otsenit vash vklad.',
            health: 'Kosti i sustavy trebuyut vnimaniya. Razminka pered rabochiim dnyem — obyazatelna.'
        },
        luckyNumber: 10, luckyColor: 'Seryy', compatibility: ['taurus', 'virgo']
    },
    {
        sign: 'aquarius', type: 'daily', date: today,
        predictions: {
            general: 'Nestandartnoe myshlenie — vasha supresila. Mir vostorgaetsya vashim videniyem.',
            love: 'Intellektualnoe sblizheniye s partnyorom ukreplyayet soyuz. Razgovarivajte.',
            career: 'Innovacii i tekhnologii — vasha stixiya. Predlozhite svezhiy vzglyad.',
            health: 'Umnoe telo: medytaciya ili yoga pomogut sbalansirovat razum i telo.'
        },
        luckyNumber: 11, luckyColor: 'Goluboy', compatibility: ['gemini', 'libra']
    },
    {
        sign: 'pisces', type: 'daily', date: today,
        predictions: {
            general: 'Intuiciya segodnya na maksimume. Vslushaytes v vnutrenniy golos.',
            love: 'Romantika i mechty perepletayutsya. Vyrazte chuvstva cherez tvorchestvo.',
            career: 'Kreativny proekty i iskusstvo prinesut udachu. Ne bojtes mechtat bolshe.',
            health: 'Son i oтdyx — vaши prioritety. Bereg.te sny — oni nesyt vazhnye poslaniya.'
        },
        luckyNumber: 12, luckyColor: 'Lavandovy', compatibility: ['cancer', 'scorpio']
    }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mystic');
        console.log('✅ Connected to MongoDB');

        let inserted = 0;
        let skipped = 0;

        for (const entry of horoscopeData) {
            const exists = await Horoscope.findOne({ sign: entry.sign, type: entry.type, date: entry.date });
            if (!exists) {
                await Horoscope.create(entry);
                inserted++;
            } else {
                skipped++;
            }
        }

        console.log(`✅ Seeding complete! Inserted: ${inserted}, Skipped (already exists): ${skipped}`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding error:', err);
        process.exit(1);
    }
};

seed();
