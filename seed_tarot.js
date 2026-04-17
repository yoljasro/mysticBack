const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TarotCard = require('./models/TarotCard');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mystic')
    .then(() => console.log('MongoDB connected for seeding Tarot Cards...'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

const tarotData = [
    // ============================================================
    // MAJOR ARCANA (Старшие Арканы) — 22 cards (0 - XXI)
    // ============================================================

    // 0 - The Fool
    {
        name: "Шут",
        description: "Начало нового пути, невинность и спонтанность. Доверьтесь жизни и сделайте первый шаг в неизвестность.",
        loveForecast: {
            description: "Новые романтические приключения ждут вас. Будьте открыты для неожиданных встреч.",
            strongPoint: "Спонтанность",
            watchOut: "Наивность",
            tipOfTheDay: "Позвольте себе быть уязвимым и настоящим."
        },
        careerForecast: {
            description: "Отличное время для начала нового проекта или смены направления.",
            strongPoint: "Энтузиазм",
            watchOut: "Безрассудство",
            tipOfTheDay: "Рискните попробовать что-то совершенно новое."
        },
        healthForecast: {
            description: "Свежая энергия наполняет вас. Попробуйте новый вид активности.",
            strongPoint: "Жизнерадостность",
            watchOut: "Неосторожность",
            tipOfTheDay: "Попробуйте новый вид спорта или активного отдыха."
        },
        image: "fool_card.png"
    },

    // I - The Magician
    {
        name: "Маг",
        description: "Сила воли, мастерство и умение проявлять желаемое в реальности. Все ресурсы у вас в руках.",
        loveForecast: {
            description: "Вы обладаете магнетизмом и притягательностью. Используйте свое обаяние с умом.",
            strongPoint: "Харизма",
            watchOut: "Манипуляция",
            tipOfTheDay: "Будьте честны в своих намерениях с партнером."
        },
        careerForecast: {
            description: "У вас есть все необходимые навыки для достижения цели. Действуйте!",
            strongPoint: "Мастерство",
            watchOut: "Хитрость",
            tipOfTheDay: "Используйте все свои таланты для продвижения."
        },
        healthForecast: {
            description: "Ваше тело отзывчиво к позитивным изменениям. Время действовать.",
            strongPoint: "Концентрация",
            watchOut: "Истощение энергии",
            tipOfTheDay: "Практикуйте осознанное дыхание и медитацию."
        },
        image: "magician_card.png"
    },

    // II - The High Priestess
    {
        name: "Верховная Жрица",
        description: "Интуиция, тайное знание и внутренняя мудрость. Прислушайтесь к голосу подсознания.",
        loveForecast: {
            description: "Скрытые чувства выходят на поверхность. Доверяйте своей интуиции.",
            strongPoint: "Глубина чувств",
            watchOut: "Замкнутость",
            tipOfTheDay: "Не бойтесь показать свои истинные чувства."
        },
        careerForecast: {
            description: "Скрытая информация может повлиять на ваши решения. Будьте внимательны.",
            strongPoint: "Интуиция",
            watchOut: "Пассивность",
            tipOfTheDay: "Доверяйте своему внутреннему чутью в рабочих вопросах."
        },
        healthForecast: {
            description: "Обратите внимание на сигналы тела. Ваш организм говорит с вами.",
            strongPoint: "Самосознание",
            watchOut: "Игнорирование симптомов",
            tipOfTheDay: "Ведите дневник самочувствия."
        },
        image: "high_priestess_card.png"
    },

    // III - The Empress
    {
        name: "Императрица",
        description: "Плодородие, изобилие и материнская забота. Время для роста и создания комфорта.",
        loveForecast: {
            description: "Ваша женственность/мужественность привлекает партнеров.",
            strongPoint: "Забота",
            watchOut: "Гиперопека",
            tipOfTheDay: "Проявите ласку и внимание к своему партнеру."
        },
        careerForecast: {
            description: "Период процветания и стабильного роста.",
            strongPoint: "Изобилие",
            watchOut: "Лень",
            tipOfTheDay: "Поддерживайте порядок на рабочем месте."
        },
        healthForecast: {
            description: "Прекрасное время для заботы о теле и красоты.",
            strongPoint: "Красота",
            watchOut: "Излишества",
            tipOfTheDay: "Побалуйте себя спа-процедурами."
        },
        image: "empress_card.png"
    },

    // IV - The Emperor
    {
        name: "Император",
        description: "Власть, структура и стабильность. Время для дисциплины и установления порядка.",
        loveForecast: {
            description: "Стабильность и надежность в отношениях. Партнер ценит вашу силу.",
            strongPoint: "Надежность",
            watchOut: "Авторитарность",
            tipOfTheDay: "Покажите партнеру, что вы — опора и защита."
        },
        careerForecast: {
            description: "Лидерство и организованность принесут результаты.",
            strongPoint: "Авторитет",
            watchOut: "Жесткость",
            tipOfTheDay: "Установите четкие правила и следуйте плану."
        },
        healthForecast: {
            description: "Дисциплинированный подход к здоровью даст отличные результаты.",
            strongPoint: "Дисциплина",
            watchOut: "Напряжение",
            tipOfTheDay: "Составьте режим дня и придерживайтесь его."
        },
        image: "emperor_card.png"
    },

    // V - The Hierophant
    {
        name: "Иерофант",
        description: "Традиции, духовное наставничество и следование установленным правилам. Ищите мудрость в проверенных источниках.",
        loveForecast: {
            description: "Традиционные ценности укрепляют союз. Возможна помолвка или свадьба.",
            strongPoint: "Верность",
            watchOut: "Консерватизм",
            tipOfTheDay: "Уважайте традиции и ценности вашего партнера."
        },
        careerForecast: {
            description: "Следование установленным процедурам принесет успех.",
            strongPoint: "Мудрость",
            watchOut: "Догматизм",
            tipOfTheDay: "Обратитесь за советом к опытному наставнику."
        },
        healthForecast: {
            description: "Проверенные методы лечения будут наиболее эффективны.",
            strongPoint: "Системность",
            watchOut: "Закрытость новому",
            tipOfTheDay: "Обратитесь к специалисту для профилактического осмотра."
        },
        image: "hierophant_card.png"
    },

    // VI - The Lovers
    {
        name: "Влюбленные",
        description: "Гармония, союз и важный выбор. Прислушайтесь к своему сердцу.",
        loveForecast: {
            description: "Наступает время искренности и глубокой привязанности.",
            strongPoint: "Связь",
            watchOut: "Нерешительность",
            tipOfTheDay: "Будьте открыты для новых чувств и искреннего общения."
        },
        careerForecast: {
            description: "Командная работа принесет отличные результаты.",
            strongPoint: "Сотрудничество",
            watchOut: "Конфликты интересов",
            tipOfTheDay: "Уделите время налаживанию связей с коллегами."
        },
        healthForecast: {
            description: "Баланс во всем — залог вашего хорошего самочувствия.",
            strongPoint: "Гармония",
            watchOut: "Эмоциональное выгорание",
            tipOfTheDay: "Займитесь йогой или медитацией."
        },
        image: "lovers_card.png"
    },

    // VII - The Chariot
    {
        name: "Колесница",
        description: "Победа, решимость и контроль. Направьте свою волю к достижению цели.",
        loveForecast: {
            description: "Активные действия в любви принесут результат. Берите инициативу.",
            strongPoint: "Решимость",
            watchOut: "Агрессивность",
            tipOfTheDay: "Не бойтесь сделать первый шаг навстречу."
        },
        careerForecast: {
            description: "Стремительное продвижение вперед. Победа близка.",
            strongPoint: "Целеустремленность",
            watchOut: "Упрямство",
            tipOfTheDay: "Сфокусируйтесь на главной цели и двигайтесь к ней."
        },
        healthForecast: {
            description: "Отличное время для интенсивных тренировок и соревнований.",
            strongPoint: "Выносливость",
            watchOut: "Перетренированность",
            tipOfTheDay: "Поставьте спортивную цель и стремитесь к ней."
        },
        image: "chariot_card.png"
    },

    // VIII - Strength
    {
        name: "Сила",
        description: "Внутренняя сила, мужество и терпение. Мягкость побеждает грубую силу.",
        loveForecast: {
            description: "Терпение и нежность укрепят ваши отношения.",
            strongPoint: "Терпение",
            watchOut: "Подавление чувств",
            tipOfTheDay: "Проявите мягкость и понимание к партнеру."
        },
        careerForecast: {
            description: "Внутренняя уверенность поможет преодолеть любые преграды.",
            strongPoint: "Стойкость",
            watchOut: "Самоуверенность",
            tipOfTheDay: "Верьте в свои силы, даже когда другие сомневаются."
        },
        healthForecast: {
            description: "Ваш организм обладает большим запасом прочности.",
            strongPoint: "Иммунитет",
            watchOut: "Игнорирование усталости",
            tipOfTheDay: "Практикуйте силовые упражнения для укрепления тела."
        },
        image: "strength_card.png"
    },

    // IX - The Hermit
    {
        name: "Отшельник",
        description: "Уединение, самопознание и поиск внутренней истины. Время для размышлений.",
        loveForecast: {
            description: "Время для осмысления своих истинных желаний в любви.",
            strongPoint: "Самопознание",
            watchOut: "Одиночество",
            tipOfTheDay: "Проведите время наедине с собой, чтобы понять чего вы хотите."
        },
        careerForecast: {
            description: "Углубленный анализ ситуации поможет найти верное решение.",
            strongPoint: "Мудрость",
            watchOut: "Изоляция",
            tipOfTheDay: "Отключитесь от суеты и обдумайте стратегию."
        },
        healthForecast: {
            description: "Покой и тишина восстановят ваши силы.",
            strongPoint: "Восстановление",
            watchOut: "Депрессия",
            tipOfTheDay: "Проведите день в тишине и покое."
        },
        image: "hermit_card.png"
    },

    // X - Wheel of Fortune
    {
        name: "Колесо Фортуны",
        description: "Судьба, перемены и цикличность жизни. Удача поворачивается к вам лицом.",
        loveForecast: {
            description: "Судьбоносная встреча или поворотный момент в отношениях.",
            strongPoint: "Удача",
            watchOut: "Непостоянство",
            tipOfTheDay: "Будьте готовы к неожиданным поворотам в личной жизни."
        },
        careerForecast: {
            description: "Колесо удачи вращается в вашу пользу. Ловите момент!",
            strongPoint: "Возможности",
            watchOut: "Нестабильность",
            tipOfTheDay: "Используйте благоприятный момент для карьерного рывка."
        },
        healthForecast: {
            description: "Перемены в самочувствии к лучшему. Цикл восстановления.",
            strongPoint: "Обновление",
            watchOut: "Перепады",
            tipOfTheDay: "Примите перемены и адаптируйтесь к новому ритму."
        },
        image: "wheel_of_fortune_card.png"
    },

    // XI - Justice
    {
        name: "Справедливость",
        description: "Баланс, истина и справедливое решение. Карма возвращает то, что вы заслужили.",
        loveForecast: {
            description: "Честность и открытость — основа крепких отношений.",
            strongPoint: "Честность",
            watchOut: "Осуждение",
            tipOfTheDay: "Будьте справедливы и честны с партнером."
        },
        careerForecast: {
            description: "Справедливое решение будет принято. Правда восторжествует.",
            strongPoint: "Объективность",
            watchOut: "Бюрократия",
            tipOfTheDay: "Действуйте честно и прозрачно."
        },
        healthForecast: {
            description: "Восстановление баланса в организме. Гармония тела и духа.",
            strongPoint: "Баланс",
            watchOut: "Перфекционизм",
            tipOfTheDay: "Найдите баланс между активностью и отдыхом."
        },
        image: "justice_card.png"
    },

    // XII - The Hanged Man
    {
        name: "Повешенный",
        description: "Пауза, жертва и новый взгляд на вещи. Иногда нужно отпустить, чтобы обрести.",
        loveForecast: {
            description: "Посмотрите на отношения под другим углом. Новая перспектива откроет глаза.",
            strongPoint: "Принятие",
            watchOut: "Жертвенность",
            tipOfTheDay: "Попробуйте увидеть ситуацию глазами партнера."
        },
        careerForecast: {
            description: "Временная пауза приведет к лучшим результатам.",
            strongPoint: "Терпение",
            watchOut: "Застой",
            tipOfTheDay: "Не торопите события, позвольте ситуации разрешиться."
        },
        healthForecast: {
            description: "Тело просит паузы. Дайте себе время на восстановление.",
            strongPoint: "Отдых",
            watchOut: "Бездействие",
            tipOfTheDay: "Устройте себе день полного расслабления."
        },
        image: "hanged_man_card.png"
    },

    // XIII - Death
    {
        name: "Смерть",
        description: "Трансформация, конец старого и начало нового. Отпустите прошлое для перерождения.",
        loveForecast: {
            description: "Глубокая трансформация чувств. Старые модели уходят безвозвратно.",
            strongPoint: "Обновление",
            watchOut: "Страх перемен",
            tipOfTheDay: "Отпустите то, что больше не служит вашему счастью."
        },
        careerForecast: {
            description: "Завершение одного этапа открывает дверь к новому.",
            strongPoint: "Трансформация",
            watchOut: "Сопротивление",
            tipOfTheDay: "Примите неизбежные перемены как возможность для роста."
        },
        healthForecast: {
            description: "Время для радикальных изменений в образе жизни.",
            strongPoint: "Перерождение",
            watchOut: "Цепляние за старое",
            tipOfTheDay: "Откажитесь от вредной привычки раз и навсегда."
        },
        image: "death_card.png"
    },

    // XIV - Temperance
    {
        name: "Умеренность",
        description: "Баланс, гармония и терпение. Золотая середина — ключ к успеху.",
        loveForecast: {
            description: "Гармоничное сочетание двух душ. Компромисс укрепляет союз.",
            strongPoint: "Гармония",
            watchOut: "Пассивность",
            tipOfTheDay: "Найдите компромисс, который устроит обоих."
        },
        careerForecast: {
            description: "Умеренный и стабильный подход принесет лучший результат.",
            strongPoint: "Терпение",
            watchOut: "Медлительность",
            tipOfTheDay: "Не спешите, действуйте обдуманно и взвешенно."
        },
        healthForecast: {
            description: "Умеренность во всем — ключ к здоровью.",
            strongPoint: "Баланс",
            watchOut: "Монотонность",
            tipOfTheDay: "Придерживайтесь сбалансированного питания."
        },
        image: "temperance_card.png"
    },

    // XV - The Devil
    {
        name: "Дьявол",
        description: "Зависимости, соблазны и материальные привязанности. Освободитесь от оков.",
        loveForecast: {
            description: "Страсть и притяжение, но есть опасность нездоровой привязанности.",
            strongPoint: "Страсть",
            watchOut: "Зависимость",
            tipOfTheDay: "Отличайте настоящую любовь от нездоровой привязанности."
        },
        careerForecast: {
            description: "Материальный успех возможен, но не ценой свободы.",
            strongPoint: "Амбиции",
            watchOut: "Жадность",
            tipOfTheDay: "Не позволяйте деньгам управлять вашими решениями."
        },
        healthForecast: {
            description: "Обратите внимание на вредные привычки и зависимости.",
            strongPoint: "Осознание",
            watchOut: "Зависимости",
            tipOfTheDay: "Избавьтесь от одной вредной привычки сегодня."
        },
        image: "devil_card.png"
    },

    // XVI - The Tower
    {
        name: "Башня",
        description: "Разрушение, внезапные перемены и освобождение. Старое рушится, чтобы уступить место новому.",
        loveForecast: {
            description: "Резкие перемены в отношениях. Разрушение иллюзий.",
            strongPoint: "Освобождение",
            watchOut: "Шок",
            tipOfTheDay: "Примите правду, какой бы болезненной она ни была."
        },
        careerForecast: {
            description: "Неожиданные события перевернут привычный порядок вещей.",
            strongPoint: "Пробуждение",
            watchOut: "Хаос",
            tipOfTheDay: "Будьте готовы к резким переменам и адаптируйтесь."
        },
        healthForecast: {
            description: "Внезапный стресс может сказаться на здоровье. Берегите себя.",
            strongPoint: "Стойкость",
            watchOut: "Стресс",
            tipOfTheDay: "Практикуйте техники управления стрессом."
        },
        image: "tower_card.png"
    },

    // XVII - The Star
    {
        name: "Звезда",
        description: "Надежда и вдохновение освещают ваш путь. Следуйте за своей мечтой.",
        loveForecast: {
            description: "Ваши чувства обретают новую глубину и ясность.",
            strongPoint: "Глубина",
            watchOut: "Идеализация",
            tipOfTheDay: "Не колебаться, если захочешь написать первой."
        },
        careerForecast: {
            description: "Время для новых идей и творческих проектов.",
            strongPoint: "Вдохновение",
            watchOut: "Нереалистичные цели",
            tipOfTheDay: "Начните проект, о котором давно мечтали."
        },
        healthForecast: {
            description: "Ваша энергия на подъеме, отличное время для восстановления.",
            strongPoint: "Витализм",
            watchOut: "Переутомление",
            tipOfTheDay: "Проведите вечер на свежем воздухе."
        },
        image: "star_card.png"
    },

    // XVIII - The Moon
    {
        name: "Луна",
        description: "Интуиция, тайны и подсознание. Обратите внимание на свои сны и предчувствия.",
        loveForecast: {
            description: "В чувствах может быть неопределенность, доверяйте интуиции.",
            strongPoint: "Интуиция",
            watchOut: "Иллюзии",
            tipOfTheDay: "Прислушайтесь к внутреннему голосу в вопросах любви."
        },
        careerForecast: {
            description: "Не все факты на виду. Будьте осторожны в делах.",
            strongPoint: "Проницательность",
            watchOut: "Обман",
            tipOfTheDay: "Тщательно проверяйте информацию."
        },
        healthForecast: {
            description: "Обратите внимание на качество сна и психологическое состояние.",
            strongPoint: "Чувствительность",
            watchOut: "Бессонница",
            tipOfTheDay: "Избегайте стресса перед сном."
        },
        image: "moon_card.png"
    },

    // XIX - The Sun
    {
        name: "Солнце",
        description: "Радость, успех и жизненная энергия. Все складывается наилучшим образом.",
        loveForecast: {
            description: "Ваши отношения наполнены теплом и светом.",
            strongPoint: "Теплота",
            watchOut: "Эгоизм",
            tipOfTheDay: "Подарите свою улыбку тому, кто вам дорог."
        },
        careerForecast: {
            description: "Ваши старания будут замечены и вознаграждены.",
            strongPoint: "Признание",
            watchOut: "Самоуверенность",
            tipOfTheDay: "Верьте в свои силы и двигайтесь вперед."
        },
        healthForecast: {
            description: "Вы полны сил и бодрости. Организм в отличной форме.",
            strongPoint: "Бодрость",
            watchOut: "Перегрев",
            tipOfTheDay: "Займитесь активным спортом."
        },
        image: "sun_card.png"
    },

    // XX - Judgement
    {
        name: "Суд",
        description: "Возрождение, пробуждение и окончательный вердикт. Время для переоценки жизни.",
        loveForecast: {
            description: "Момент истины в отношениях. Пришло время сделать выбор.",
            strongPoint: "Ясность",
            watchOut: "Самокритика",
            tipOfTheDay: "Простите себя и партнера за прошлые ошибки."
        },
        careerForecast: {
            description: "Пришло время подвести итоги и начать новый этап.",
            strongPoint: "Прозрение",
            watchOut: "Осуждение",
            tipOfTheDay: "Оцените свой профессиональный путь объективно."
        },
        healthForecast: {
            description: "Пробуждение нового отношения к своему телу и здоровью.",
            strongPoint: "Осознанность",
            watchOut: "Чувство вины",
            tipOfTheDay: "Начните новую программу оздоровления."
        },
        image: "judgement_card.png"
    },

    // XXI - The World
    {
        name: "Мир",
        description: "Завершение, целостность и достижение цели. Цикл завершен, вы достигли вершины.",
        loveForecast: {
            description: "Полная гармония и удовлетворение в отношениях.",
            strongPoint: "Целостность",
            watchOut: "Завершенность",
            tipOfTheDay: "Наслаждайтесь тем, что вы создали вместе."
        },
        careerForecast: {
            description: "Крупный проект завершен. Пожинайте плоды своего труда.",
            strongPoint: "Достижение",
            watchOut: "Стагнация",
            tipOfTheDay: "Отпразднуйте свои достижения перед новым началом."
        },
        healthForecast: {
            description: "Полная гармония тела, разума и духа.",
            strongPoint: "Целостность",
            watchOut: "Самодовольство",
            tipOfTheDay: "Сохраняйте достигнутый баланс и гармонию."
        },
        image: "world_card.png"
    },

    // ============================================================
    // MINOR ARCANA — WANDS (Жезлы) — 14 cards
    // ============================================================

    // Ace of Wands
    {
        name: "Туз Жезлов",
        description: "Новое начало, вдохновение и творческий импульс. Искра новой идеи зажигается.",
        loveForecast: {
            description: "Вспышка страсти и новый виток в отношениях.",
            strongPoint: "Страсть",
            watchOut: "Импульсивность",
            tipOfTheDay: "Проявите инициативу в романтике."
        },
        careerForecast: {
            description: "Новая блестящая идея или возможность для старта.",
            strongPoint: "Инициатива",
            watchOut: "Поспешность",
            tipOfTheDay: "Запишите все свои идеи и начните действовать."
        },
        healthForecast: {
            description: "Прилив энергии и жизненных сил.",
            strongPoint: "Энергия",
            watchOut: "Выгорание",
            tipOfTheDay: "Направьте энергию на активные тренировки."
        },
        image: "ace_wands.png"
    },

    // Two of Wands
    {
        name: "Двойка Жезлов",
        description: "Планирование, выбор направления и дальновидность. Мир открыт перед вами.",
        loveForecast: {
            description: "Время спланировать будущее отношений. Обсудите планы с партнером.",
            strongPoint: "Планирование",
            watchOut: "Нерешительность",
            tipOfTheDay: "Поговорите с партнером о совместных планах."
        },
        careerForecast: {
            description: "Стратегическое планирование принесет плоды в будущем.",
            strongPoint: "Видение",
            watchOut: "Бездействие",
            tipOfTheDay: "Составьте план действий на ближайший месяц."
        },
        healthForecast: {
            description: "Планирование здорового образа жизни — первый шаг к переменам.",
            strongPoint: "Предвидение",
            watchOut: "Откладывание",
            tipOfTheDay: "Составьте план питания и тренировок."
        },
        image: "two_wands.png"
    },

    // Three of Wands
    {
        name: "Тройка Жезлов",
        description: "Расширение горизонтов, рост и ожидание результатов. Ваши усилия начинают приносить плоды.",
        loveForecast: {
            description: "Расширение горизонтов в отношениях. Возможна встреча на расстоянии.",
            strongPoint: "Расширение",
            watchOut: "Нетерпение",
            tipOfTheDay: "Будьте терпеливы — лучшее еще впереди."
        },
        careerForecast: {
            description: "Ваши планы начинают воплощаться. Ожидайте роста.",
            strongPoint: "Прогресс",
            watchOut: "Самодовольство",
            tipOfTheDay: "Расширяйте свою сеть контактов."
        },
        healthForecast: {
            description: "Положительные изменения в здоровье уже на подходе.",
            strongPoint: "Рост",
            watchOut: "Переоценка сил",
            tipOfTheDay: "Продолжайте начатое — результаты скоро будут видны."
        },
        image: "three_wands.png"
    },

    // Four of Wands
    {
        name: "Четверка Жезлов",
        description: "Праздник, домашний уют и стабильность. Время для радости и торжества.",
        loveForecast: {
            description: "Праздник любви. Возможна помолвка, свадьба или совместное торжество.",
            strongPoint: "Радость",
            watchOut: "Поверхностность",
            tipOfTheDay: "Устройте романтический вечер для двоих."
        },
        careerForecast: {
            description: "Достижение промежуточной цели. Время для празднования.",
            strongPoint: "Стабильность",
            watchOut: "Расслабленность",
            tipOfTheDay: "Отпразднуйте свои рабочие достижения с командой."
        },
        healthForecast: {
            description: "Ощущение стабильности и комфорта в теле.",
            strongPoint: "Комфорт",
            watchOut: "Застой",
            tipOfTheDay: "Создайте уютную атмосферу для отдыха дома."
        },
        image: "four_wands.png"
    },

    // Five of Wands
    {
        name: "Пятерка Жезлов",
        description: "Конфликт, соперничество и борьба мнений. Конкуренция закаляет характер.",
        loveForecast: {
            description: "Мелкие ссоры и разногласия. Важно найти общий язык.",
            strongPoint: "Энергичность",
            watchOut: "Конфликтность",
            tipOfTheDay: "Избегайте ненужных споров с партнером."
        },
        careerForecast: {
            description: "Конкуренция на работе. Используйте ее как стимул.",
            strongPoint: "Соревновательность",
            watchOut: "Враждебность",
            tipOfTheDay: "Превратите конкуренцию в мотивацию для роста."
        },
        healthForecast: {
            description: "Внутреннее напряжение требует физической разрядки.",
            strongPoint: "Энергия борьбы",
            watchOut: "Стресс",
            tipOfTheDay: "Займитесь боевыми искусствами или активным спортом."
        },
        image: "five_wands.png"
    },

    // Six of Wands
    {
        name: "Шестерка Жезлов",
        description: "Триумф, признание и публичный успех. Ваши достижения будут замечены.",
        loveForecast: {
            description: "Ваш партнер гордится вами. Взаимное восхищение.",
            strongPoint: "Признание",
            watchOut: "Тщеславие",
            tipOfTheDay: "Поделитесь своим успехом с любимым человеком."
        },
        careerForecast: {
            description: "Публичное признание ваших заслуг. Карьерный триумф.",
            strongPoint: "Триумф",
            watchOut: "Гордыня",
            tipOfTheDay: "Примите похвалу с достоинством и поблагодарите команду."
        },
        healthForecast: {
            description: "Отличное самочувствие и внешний вид. Вы сияете!",
            strongPoint: "Уверенность",
            watchOut: "Зазнайство",
            tipOfTheDay: "Поддерживайте форму, чтобы чувствовать себя победителем."
        },
        image: "six_wands.png"
    },

    // Seven of Wands
    {
        name: "Семерка Жезлов",
        description: "Защита позиций, стойкость и вызов. Отстаивайте свои убеждения.",
        loveForecast: {
            description: "Защищайте свои отношения от внешних влияний.",
            strongPoint: "Стойкость",
            watchOut: "Оборонительность",
            tipOfTheDay: "Не позволяйте посторонним вмешиваться в ваши отношения."
        },
        careerForecast: {
            description: "Вам придется отстаивать свою позицию. Будьте тверды.",
            strongPoint: "Уверенность",
            watchOut: "Агрессия",
            tipOfTheDay: "Подготовьте аргументы в защиту вашей позиции."
        },
        healthForecast: {
            description: "Организм борется с нагрузками. Поддержите его.",
            strongPoint: "Сопротивляемость",
            watchOut: "Перенапряжение",
            tipOfTheDay: "Укрепите иммунитет витаминами и правильным питанием."
        },
        image: "seven_wands.png"
    },

    // Eight of Wands
    {
        name: "Восьмерка Жезлов",
        description: "Быстрое движение, прогресс и стремительные события. Все ускоряется.",
        loveForecast: {
            description: "Стремительное развитие романа. События несут вас вперед.",
            strongPoint: "Скорость",
            watchOut: "Спешка",
            tipOfTheDay: "Наслаждайтесь быстрым развитием событий."
        },
        careerForecast: {
            description: "Быстрый прогресс в делах. Новости и сообщения летят отовсюду.",
            strongPoint: "Динамика",
            watchOut: "Хаотичность",
            tipOfTheDay: "Действуйте быстро, пока окно возможностей открыто."
        },
        healthForecast: {
            description: "Быстрое восстановление и прилив энергии.",
            strongPoint: "Быстрота",
            watchOut: "Суетливость",
            tipOfTheDay: "Займитесь бегом или быстрой ходьбой."
        },
        image: "eight_wands.png"
    },

    // Nine of Wands
    {
        name: "Девятка Жезлов",
        description: "Стойкость, упорство и последний рубеж. Не сдавайтесь — вы почти у цели.",
        loveForecast: {
            description: "Вы устали от борьбы, но не сдавайтесь. Любовь стоит усилий.",
            strongPoint: "Упорство",
            watchOut: "Паранойя",
            tipOfTheDay: "Не теряйте веру в любовь, даже когда тяжело."
        },
        careerForecast: {
            description: "Последний рывок перед достижением цели. Держитесь!",
            strongPoint: "Настойчивость",
            watchOut: "Подозрительность",
            tipOfTheDay: "Соберите все силы для финального рывка."
        },
        healthForecast: {
            description: "Тело устало, но у вас есть запас прочности.",
            strongPoint: "Выживание",
            watchOut: "Хроническая усталость",
            tipOfTheDay: "Дайте себе отдых, но не бросайте начатое."
        },
        image: "nine_wands.png"
    },

    // Ten of Wands
    {
        name: "Десятка Жезлов",
        description: "Тяжелая ноша, бремя ответственности и перегрузка. Научитесь делегировать.",
        loveForecast: {
            description: "Слишком много ответственности в отношениях. Разделите бремя.",
            strongPoint: "Ответственность",
            watchOut: "Перегрузка",
            tipOfTheDay: "Попросите партнера разделить обязанности."
        },
        careerForecast: {
            description: "Слишком много задач на одном человеке. Пора делегировать.",
            strongPoint: "Трудолюбие",
            watchOut: "Выгорание",
            tipOfTheDay: "Делегируйте то, что можно поручить другим."
        },
        healthForecast: {
            description: "Физическое и эмоциональное перенапряжение. Снизьте нагрузку.",
            strongPoint: "Выносливость",
            watchOut: "Истощение",
            tipOfTheDay: "Отдохните и снимите груз лишних обязательств."
        },
        image: "ten_wands.png"
    },

    // Page of Wands
    {
        name: "Паж Жезлов",
        description: "Любопытство, энтузиазм и новые возможности. Молодая энергия и жажда приключений.",
        loveForecast: {
            description: "Легкий флирт и игривое настроение. Новое увлечение.",
            strongPoint: "Игривость",
            watchOut: "Поверхностность",
            tipOfTheDay: "Добавьте игривости в ваши отношения."
        },
        careerForecast: {
            description: "Новая идея или предложение вызывает энтузиазм.",
            strongPoint: "Любопытство",
            watchOut: "Незрелость",
            tipOfTheDay: "Исследуйте новые возможности с открытым разумом."
        },
        healthForecast: {
            description: "Молодой задор и энергия. Отличное время для новых увлечений.",
            strongPoint: "Живость",
            watchOut: "Рассеянность",
            tipOfTheDay: "Попробуйте новый вид активности."
        },
        image: "page_wands.png"
    },

    // Knight of Wands
    {
        name: "Рыцарь Жезлов",
        description: "Действие, приключения и смелость. Храбрый воин идет к своей цели.",
        loveForecast: {
            description: "Страстный и импульсивный роман. Авантюрный дух.",
            strongPoint: "Смелость",
            watchOut: "Безрассудство",
            tipOfTheDay: "Будьте смелы в проявлении чувств."
        },
        careerForecast: {
            description: "Активные действия и смелые решения ведут к успеху.",
            strongPoint: "Храбрость",
            watchOut: "Горячность",
            tipOfTheDay: "Действуйте решительно, но обдуманно."
        },
        healthForecast: {
            description: "Активный образ жизни и приключения заряжают энергией.",
            strongPoint: "Активность",
            watchOut: "Травмы",
            tipOfTheDay: "Займитесь экстремальным видом спорта."
        },
        image: "knight_wands.png"
    },

    // Queen of Wands
    {
        name: "Королева Жезлов",
        description: "Уверенность, теплота и независимость. Яркая личность, излучающая магнетизм.",
        loveForecast: {
            description: "Ваша уверенность и теплота притягивают людей как магнит.",
            strongPoint: "Магнетизм",
            watchOut: "Ревность",
            tipOfTheDay: "Будьте верны себе — это ваша главная сила."
        },
        careerForecast: {
            description: "Лидерские качества и обаяние помогают достичь целей.",
            strongPoint: "Обаяние",
            watchOut: "Доминирование",
            tipOfTheDay: "Вдохновляйте других своим примером."
        },
        healthForecast: {
            description: "Вы излучаете здоровье и жизненную силу.",
            strongPoint: "Витальность",
            watchOut: "Переутомление",
            tipOfTheDay: "Поддерживайте свой внутренний огонь правильным питанием."
        },
        image: "queen_wands.png"
    },

    // King of Wands
    {
        name: "Король Жезлов",
        description: "Смелое лидерство, видение и предпринимательский дух. Рожденный вести за собой.",
        loveForecast: {
            description: "Сильный и страстный партнер. Лидерство в отношениях.",
            strongPoint: "Лидерство",
            watchOut: "Деспотизм",
            tipOfTheDay: "Ведите отношения мудро, а не силой."
        },
        careerForecast: {
            description: "Вы — прирожденный лидер. Ваше видение ведет к успеху.",
            strongPoint: "Предпринимательство",
            watchOut: "Тирания",
            tipOfTheDay: "Создайте вдохновляющую атмосферу в команде."
        },
        healthForecast: {
            description: "Мощная жизненная энергия. Вы способны на многое.",
            strongPoint: "Мощь",
            watchOut: "Переоценка сил",
            tipOfTheDay: "Направьте свою энергию конструктивно."
        },
        image: "king_wands.png"
    },

    // ============================================================
    // MINOR ARCANA — CUPS (Кубки) — 14 cards
    // ============================================================

    // Ace of Cups
    {
        name: "Туз Кубков",
        description: "Новая любовь, эмоциональное начало и переполняющие чувства. Сердце открывается.",
        loveForecast: {
            description: "Начало новой любви или обновление чувств в существующих отношениях.",
            strongPoint: "Открытость",
            watchOut: "Идеализация",
            tipOfTheDay: "Откройте сердце для новых чувств."
        },
        careerForecast: {
            description: "Эмоциональное удовлетворение от работы. Творческое вдохновение.",
            strongPoint: "Вдохновение",
            watchOut: "Непрактичность",
            tipOfTheDay: "Следуйте за тем, что приносит радость в работе."
        },
        healthForecast: {
            description: "Эмоциональное обновление позитивно влияет на здоровье.",
            strongPoint: "Эмоциональное здоровье",
            watchOut: "Сентиментальность",
            tipOfTheDay: "Выразите свои эмоции через творчество."
        },
        image: "ace_cups.png"
    },

    // Two of Cups
    {
        name: "Двойка Кубков",
        description: "Партнерство, взаимная любовь и глубокая связь двух душ.",
        loveForecast: {
            description: "Гармоничный союз. Взаимные чувства и глубокое понимание.",
            strongPoint: "Взаимность",
            watchOut: "Созависимость",
            tipOfTheDay: "Цените и укрепляйте вашу связь."
        },
        careerForecast: {
            description: "Отличное партнерство или сотрудничество на работе.",
            strongPoint: "Партнерство",
            watchOut: "Зависимость от партнера",
            tipOfTheDay: "Найдите надежного партнера для совместного дела."
        },
        healthForecast: {
            description: "Эмоциональная поддержка близкого человека улучшает здоровье.",
            strongPoint: "Поддержка",
            watchOut: "Эмоциональная зависимость",
            tipOfTheDay: "Занимайтесь спортом вместе с партнером."
        },
        image: "two_cups.png"
    },

    // Three of Cups
    {
        name: "Тройка Кубков",
        description: "Дружба, праздник и радость общения. Время для веселья с близкими.",
        loveForecast: {
            description: "Радостное общение и веселье. Возможна встреча через друзей.",
            strongPoint: "Дружелюбие",
            watchOut: "Легкомыслие",
            tipOfTheDay: "Проведите время с друзьями и близкими."
        },
        careerForecast: {
            description: "Командный дух и радость от совместной работы.",
            strongPoint: "Командный дух",
            watchOut: "Отвлечение",
            tipOfTheDay: "Организуйте командное мероприятие."
        },
        healthForecast: {
            description: "Общение и веселье поднимают настроение и иммунитет.",
            strongPoint: "Позитив",
            watchOut: "Излишества в еде и алкоголе",
            tipOfTheDay: "Встретьтесь с друзьями на свежем воздухе."
        },
        image: "three_cups.png"
    },

    // Four of Cups
    {
        name: "Четверка Кубков",
        description: "Апатия, скука и неудовлетворенность. Вы не замечаете то, что прямо перед вами.",
        loveForecast: {
            description: "Вы не замечаете возможности для счастья. Откройте глаза.",
            strongPoint: "Созерцание",
            watchOut: "Апатия",
            tipOfTheDay: "Посмотрите вокруг — рядом есть тот, кто вас ценит."
        },
        careerForecast: {
            description: "Скука и неудовлетворенность работой. Ищите новые источники мотивации.",
            strongPoint: "Переоценка",
            watchOut: "Безразличие",
            tipOfTheDay: "Обратите внимание на возможности, которые вы упускаете."
        },
        healthForecast: {
            description: "Эмоциональная усталость влияет на физическое состояние.",
            strongPoint: "Самоанализ",
            watchOut: "Депрессия",
            tipOfTheDay: "Найдите новое хобби для эмоциональной подзарядки."
        },
        image: "four_cups.png"
    },

    // Five of Cups
    {
        name: "Пятерка Кубков",
        description: "Печаль, потеря и сожаление. Но два кубка все еще стоят — не все потеряно.",
        loveForecast: {
            description: "Боль от потери или разочарования. Но надежда остается.",
            strongPoint: "Глубина чувств",
            watchOut: "Горечь",
            tipOfTheDay: "Не зацикливайтесь на потерях — посмотрите, что осталось."
        },
        careerForecast: {
            description: "Неудача или разочарование на работе. Учитесь на ошибках.",
            strongPoint: "Стойкость",
            watchOut: "Пессимизм",
            tipOfTheDay: "Примите урок и двигайтесь дальше."
        },
        healthForecast: {
            description: "Эмоциональный стресс ослабляет организм.",
            strongPoint: "Исцеление",
            watchOut: "Подавление чувств",
            tipOfTheDay: "Позвольте себе прожить грусть и отпустить ее."
        },
        image: "five_cups.png"
    },

    // Six of Cups
    {
        name: "Шестерка Кубков",
        description: "Ностальгия, воспоминания и невинная радость. Прошлое дарит теплые чувства.",
        loveForecast: {
            description: "Встреча с бывшим или воспоминания о первой любви.",
            strongPoint: "Нежность",
            watchOut: "Жизнь прошлым",
            tipOfTheDay: "Вспомните лучшие моменты и создайте новые."
        },
        careerForecast: {
            description: "Старые связи или прежний опыт помогут в настоящем.",
            strongPoint: "Опыт",
            watchOut: "Ностальгия",
            tipOfTheDay: "Обратитесь к старым контактам — они могут помочь."
        },
        healthForecast: {
            description: "Радостные воспоминания улучшают настроение и здоровье.",
            strongPoint: "Щедрость",
            watchOut: "Сожаление",
            tipOfTheDay: "Вернитесь к любимым занятиям из детства."
        },
        image: "six_cups.png"
    },

    // Seven of Cups
    {
        name: "Семерка Кубков",
        description: "Мечты, фантазии и множество вариантов. Не все то золото, что блестит.",
        loveForecast: {
            description: "Множество вариантов или фантазии об идеальных отношениях.",
            strongPoint: "Воображение",
            watchOut: "Иллюзии",
            tipOfTheDay: "Отличайте реальность от фантазий в любви."
        },
        careerForecast: {
            description: "Слишком много вариантов затрудняют выбор.",
            strongPoint: "Креативность",
            watchOut: "Разбросанность",
            tipOfTheDay: "Выберите одну цель и сосредоточьтесь на ней."
        },
        healthForecast: {
            description: "Мечтательность отвлекает от реальных потребностей тела.",
            strongPoint: "Вдохновение",
            watchOut: "Самообман",
            tipOfTheDay: "Вернитесь с небес на землю и займитесь здоровьем."
        },
        image: "seven_cups.png"
    },

    // Eight of Cups
    {
        name: "Восьмерка Кубков",
        description: "Уход, отказ от привычного и поиск глубинного смысла. Время двигаться дальше.",
        loveForecast: {
            description: "Решение уйти в поисках чего-то большего. Эмоциональное взросление.",
            strongPoint: "Смелость",
            watchOut: "Бегство",
            tipOfTheDay: "Если отношения исчерпали себя — дайте себе право уйти."
        },
        careerForecast: {
            description: "Уход от того, что больше не приносит удовлетворения.",
            strongPoint: "Решимость",
            watchOut: "Импульсивность",
            tipOfTheDay: "Если работа не приносит радости — ищите новый путь."
        },
        healthForecast: {
            description: "Отказ от вредных привычек ради лучшего здоровья.",
            strongPoint: "Осознанность",
            watchOut: "Грусть",
            tipOfTheDay: "Оставьте позади то, что вредит вашему здоровью."
        },
        image: "eight_cups.png"
    },

    // Nine of Cups
    {
        name: "Девятка Кубков",
        description: "Исполнение желаний, удовольствие и эмоциональное удовлетворение. Карта исполнения мечты.",
        loveForecast: {
            description: "Ваши романтические мечты сбываются. Полное удовлетворение.",
            strongPoint: "Удовлетворение",
            watchOut: "Самодовольство",
            tipOfTheDay: "Наслаждайтесь моментом счастья."
        },
        careerForecast: {
            description: "Достижение желаемого результата. Время наслаждаться успехом.",
            strongPoint: "Успех",
            watchOut: "Гедонизм",
            tipOfTheDay: "Поблагодарите себя за достигнутые результаты."
        },
        healthForecast: {
            description: "Отличное самочувствие и эмоциональный подъем.",
            strongPoint: "Благополучие",
            watchOut: "Переедание",
            tipOfTheDay: "Побалуйте себя, но в меру."
        },
        image: "nine_cups.png"
    },

    // Ten of Cups
    {
        name: "Десятка Кубков",
        description: "Семейное счастье, гармония и эмоциональная полнота. Идеальная картина любви.",
        loveForecast: {
            description: "Полная гармония в семье. Идеальные отношения.",
            strongPoint: "Семейное счастье",
            watchOut: "Идеализация",
            tipOfTheDay: "Цените каждый момент семейного счастья."
        },
        careerForecast: {
            description: "Идеальный баланс между работой и личной жизнью.",
            strongPoint: "Гармония",
            watchOut: "Застой",
            tipOfTheDay: "Создайте гармонию между карьерой и семьей."
        },
        healthForecast: {
            description: "Эмоциональное благополучие отражается на физическом здоровье.",
            strongPoint: "Полнота жизни",
            watchOut: "Пренебрежение собой ради других",
            tipOfTheDay: "Проведите здоровый вечер в кругу семьи."
        },
        image: "ten_cups.png"
    },

    // Page of Cups
    {
        name: "Паж Кубков",
        description: "Творческое вдохновение, романтические послания и мечтательность.",
        loveForecast: {
            description: "Романтическое послание или приятный сюрприз.",
            strongPoint: "Романтика",
            watchOut: "Наивность",
            tipOfTheDay: "Отправьте любовное письмо или сообщение."
        },
        careerForecast: {
            description: "Творческая идея или интересное предложение.",
            strongPoint: "Творчество",
            watchOut: "Мечтательность",
            tipOfTheDay: "Запишите все творческие идеи."
        },
        healthForecast: {
            description: "Творческие занятия благотворно влияют на здоровье.",
            strongPoint: "Чувствительность",
            watchOut: "Уязвимость",
            tipOfTheDay: "Займитесь творчеством для эмоциональной разгрузки."
        },
        image: "page_cups.png"
    },

    // Knight of Cups
    {
        name: "Рыцарь Кубков",
        description: "Романтик, мечтатель и посланник любви. Время для красивых жестов.",
        loveForecast: {
            description: "Романтическое предложение или появление нового поклонника.",
            strongPoint: "Романтизм",
            watchOut: "Непостоянство",
            tipOfTheDay: "Сделайте красивый романтический жест."
        },
        careerForecast: {
            description: "Предложение, связанное с творчеством или искусством.",
            strongPoint: "Элегантность",
            watchOut: "Непрактичность",
            tipOfTheDay: "Подойдите к рабочим задачам творчески."
        },
        healthForecast: {
            description: "Эмоции влияют на тело. Следите за настроением.",
            strongPoint: "Эмоциональная чуткость",
            watchOut: "Перепады настроения",
            tipOfTheDay: "Балансируйте эмоции через арт-терапию."
        },
        image: "knight_cups.png"
    },

    // Queen of Cups
    {
        name: "Королева Кубков",
        description: "Эмоциональная зрелость, сочувствие и интуитивная мудрость.",
        loveForecast: {
            description: "Глубокое эмоциональное понимание партнера. Безусловная любовь.",
            strongPoint: "Сочувствие",
            watchOut: "Жертвенность",
            tipOfTheDay: "Позаботьтесь о себе так же, как заботитесь о других."
        },
        careerForecast: {
            description: "Интуиция помогает принимать верные решения.",
            strongPoint: "Эмпатия",
            watchOut: "Эмоциональность",
            tipOfTheDay: "Используйте эмоциональный интеллект в работе."
        },
        healthForecast: {
            description: "Забота о других не должна идти в ущерб вашему здоровью.",
            strongPoint: "Исцеление",
            watchOut: "Самопожертвование",
            tipOfTheDay: "Уделите время заботе о своем теле."
        },
        image: "queen_cups.png"
    },

    // King of Cups
    {
        name: "Король Кубков",
        description: "Эмоциональная мудрость, дипломатия и контроль чувств. Зрелый и уравновешенный лидер.",
        loveForecast: {
            description: "Мудрый и заботливый партнер. Эмоциональная стабильность.",
            strongPoint: "Мудрость сердца",
            watchOut: "Эмоциональная холодность",
            tipOfTheDay: "Будьте эмоциональной опорой для партнера."
        },
        careerForecast: {
            description: "Дипломатичный подход решит сложные ситуации.",
            strongPoint: "Дипломатия",
            watchOut: "Подавление эмоций",
            tipOfTheDay: "Управляйте ситуацией с холодной головой и теплым сердцем."
        },
        healthForecast: {
            description: "Эмоциональное равновесие — основа здоровья.",
            strongPoint: "Уравновешенность",
            watchOut: "Скрытый стресс",
            tipOfTheDay: "Найдите здоровый способ выражать эмоции."
        },
        image: "king_cups.png"
    },

    // ============================================================
    // MINOR ARCANA — SWORDS (Мечи) — 14 cards
    // ============================================================

    // Ace of Swords
    {
        name: "Туз Мечей",
        description: "Ясность мысли, прорыв и новая идея. Истина рассекает тьму.",
        loveForecast: {
            description: "Ясность в чувствах. Время для честного разговора.",
            strongPoint: "Ясность",
            watchOut: "Резкость",
            tipOfTheDay: "Скажите правду, даже если она неудобна."
        },
        careerForecast: {
            description: "Блестящая идея или ментальный прорыв.",
            strongPoint: "Интеллект",
            watchOut: "Категоричность",
            tipOfTheDay: "Используйте ясность ума для решения сложных задач."
        },
        healthForecast: {
            description: "Ментальная ясность улучшает общее самочувствие.",
            strongPoint: "Острота ума",
            watchOut: "Перенапряжение мозга",
            tipOfTheDay: "Займитесь головоломками или интеллектуальными играми."
        },
        image: "ace_swords.png"
    },

    // Two of Swords
    {
        name: "Двойка Мечей",
        description: "Тупик, сложный выбор и внутренний конфликт. Два пути, и оба непросты.",
        loveForecast: {
            description: "Сложный выбор в любви. Нужно принять решение.",
            strongPoint: "Объективность",
            watchOut: "Нерешительность",
            tipOfTheDay: "Снимите повязку с глаз и посмотрите правде в лицо."
        },
        careerForecast: {
            description: "Два варианта, и оба имеют плюсы и минусы.",
            strongPoint: "Анализ",
            watchOut: "Паралич выбора",
            tipOfTheDay: "Взвесьте все за и против и примите решение."
        },
        healthForecast: {
            description: "Внутренний конфликт создает напряжение в теле.",
            strongPoint: "Спокойствие",
            watchOut: "Головные боли",
            tipOfTheDay: "Медитация поможет найти ответ."
        },
        image: "two_swords.png"
    },

    // Three of Swords
    {
        name: "Тройка Мечей",
        description: "Боль сердца, предательство и горе. Но через боль приходит исцеление.",
        loveForecast: {
            description: "Разбитое сердце, измена или болезненное расставание.",
            strongPoint: "Честность",
            watchOut: "Горе",
            tipOfTheDay: "Позвольте себе прожить боль, чтобы исцелиться."
        },
        careerForecast: {
            description: "Болезненная правда о ситуации на работе.",
            strongPoint: "Правда",
            watchOut: "Критика",
            tipOfTheDay: "Примите конструктивную критику как урок."
        },
        healthForecast: {
            description: "Эмоциональная боль влияет на сердце. Берегите себя.",
            strongPoint: "Катарсис",
            watchOut: "Кардиологические проблемы",
            tipOfTheDay: "Поговорите с кем-то близким о своих переживаниях."
        },
        image: "three_swords.png"
    },

    // Four of Swords
    {
        name: "Четверка Мечей",
        description: "Отдых, восстановление и медитация. Время для перезагрузки ума и тела.",
        loveForecast: {
            description: "Пауза в отношениях для восстановления сил.",
            strongPoint: "Покой",
            watchOut: "Изоляция",
            tipOfTheDay: "Дайте себе и партнеру пространство для отдыха."
        },
        careerForecast: {
            description: "Необходим перерыв для восстановления сил.",
            strongPoint: "Восстановление",
            watchOut: "Избегание",
            tipOfTheDay: "Возьмите выходной для перезагрузки."
        },
        healthForecast: {
            description: "Тело требует полного отдыха и восстановления.",
            strongPoint: "Покой",
            watchOut: "Застой",
            tipOfTheDay: "Выспитесь как следует и дайте телу восстановиться."
        },
        image: "four_swords.png"
    },

    // Five of Swords
    {
        name: "Пятерка Мечей",
        description: "Конфликт, поражение и пиррова победа. Иногда лучше уступить.",
        loveForecast: {
            description: "Ссора, в которой нет победителей. Нужно отступить.",
            strongPoint: "Реализм",
            watchOut: "Агрессия",
            tipOfTheDay: "Уступите в споре ради сохранения отношений."
        },
        careerForecast: {
            description: "Конфликт на работе, в котором победа не стоит цены.",
            strongPoint: "Стратегия",
            watchOut: "Подлость",
            tipOfTheDay: "Не побеждайте ценой репутации."
        },
        healthForecast: {
            description: "Конфликты истощают нервную систему.",
            strongPoint: "Осознание",
            watchOut: "Нервное истощение",
            tipOfTheDay: "Избегайте ненужных конфликтов ради здоровья."
        },
        image: "five_swords.png"
    },

    // Six of Swords
    {
        name: "Шестерка Мечей",
        description: "Переход, перемещение и движение к спокойствию. Оставляйте трудности позади.",
        loveForecast: {
            description: "Переход к более спокойному этапу в отношениях.",
            strongPoint: "Движение вперед",
            watchOut: "Бегство от проблем",
            tipOfTheDay: "Оставьте прошлые обиды и двигайтесь к мирному будущему."
        },
        careerForecast: {
            description: "Переход на новую работу или в новую сферу.",
            strongPoint: "Адаптация",
            watchOut: "Неуверенность",
            tipOfTheDay: "Примите необходимость перемен."
        },
        healthForecast: {
            description: "Постепенное улучшение после трудного периода.",
            strongPoint: "Исцеление",
            watchOut: "Медленное восстановление",
            tipOfTheDay: "Смените обстановку для восстановления."
        },
        image: "six_swords.png"
    },

    // Seven of Swords
    {
        name: "Семерка Мечей",
        description: "Хитрость, обман и скрытые действия. Будьте бдительны.",
        loveForecast: {
            description: "Кто-то может скрывать правду. Будьте внимательны к знакам.",
            strongPoint: "Бдительность",
            watchOut: "Обман",
            tipOfTheDay: "Доверяйте, но проверяйте."
        },
        careerForecast: {
            description: "Коварство на работе. Защитите свои интересы.",
            strongPoint: "Находчивость",
            watchOut: "Нечестность",
            tipOfTheDay: "Будьте осторожны с конфиденциальной информацией."
        },
        healthForecast: {
            description: "Не игнорируйте тревожные симптомы. Обратитесь к врачу.",
            strongPoint: "Внимательность",
            watchOut: "Самообман",
            tipOfTheDay: "Пройдите обследование, которое откладывали."
        },
        image: "seven_swords.png"
    },

    // Eight of Swords
    {
        name: "Восьмерка Мечей",
        description: "Ограничения, чувство ловушки и самоограничение. Путь к свободе начинается в голове.",
        loveForecast: {
            description: "Чувство заточения в отношениях. Но выход есть.",
            strongPoint: "Осознание",
            watchOut: "Жертвенность",
            tipOfTheDay: "Поймите, что ограничения — в вашем уме. Вы свободны."
        },
        careerForecast: {
            description: "Ощущение ловушки на работе. Но выход ближе, чем кажется.",
            strongPoint: "Терпение",
            watchOut: "Беспомощность",
            tipOfTheDay: "Ищите нестандартные решения."
        },
        healthForecast: {
            description: "Психологические ограничения влияют на физическое здоровье.",
            strongPoint: "Самоанализ",
            watchOut: "Тревожность",
            tipOfTheDay: "Обратитесь к психологу, если чувствуете себя в ловушке."
        },
        image: "eight_swords.png"
    },

    // Nine of Swords
    {
        name: "Девятка Мечей",
        description: "Тревога, бессонница и ночные кошмары. Страхи преувеличены в темноте.",
        loveForecast: {
            description: "Тревога и страхи мешают любви. Не все так плохо, как кажется.",
            strongPoint: "Чувствительность",
            watchOut: "Паника",
            tipOfTheDay: "Поделитесь своими страхами с партнером."
        },
        careerForecast: {
            description: "Тревога о работе не дает покоя. Многие страхи преувеличены.",
            strongPoint: "Предусмотрительность",
            watchOut: "Катастрофизация",
            tipOfTheDay: "Запишите свои страхи — на бумаге они выглядят меньше."
        },
        healthForecast: {
            description: "Бессонница и тревога подрывают здоровье.",
            strongPoint: "Бдительность",
            watchOut: "Бессонница",
            tipOfTheDay: "Практикуйте технику расслабления перед сном."
        },
        image: "nine_swords.png"
    },

    // Ten of Swords
    {
        name: "Десятка Мечей",
        description: "Конец, дно и завершение болезненного цикла. Рассвет следует за самой темной ночью.",
        loveForecast: {
            description: "Болезненный конец. Но это освобождает место для нового.",
            strongPoint: "Принятие",
            watchOut: "Отчаяние",
            tipOfTheDay: "Примите конец как начало чего-то нового."
        },
        careerForecast: {
            description: "Полный крах планов. Но за дном следует подъем.",
            strongPoint: "Стойкость",
            watchOut: "Драматизация",
            tipOfTheDay: "Помните: после дна есть только один путь — вверх."
        },
        healthForecast: {
            description: "Кризис здоровья требует немедленного внимания.",
            strongPoint: "Выживание",
            watchOut: "Игнорирование",
            tipOfTheDay: "Обратитесь за медицинской помощью без промедления."
        },
        image: "ten_swords.png"
    },

    // Page of Swords
    {
        name: "Паж Мечей",
        description: "Любознательность, новые идеи и жажда знаний. Острый молодой ум.",
        loveForecast: {
            description: "Интеллектуальное притяжение. Ум привлекает больше, чем внешность.",
            strongPoint: "Остроумие",
            watchOut: "Сплетни",
            tipOfTheDay: "Завоюйте сердце своим интеллектом."
        },
        careerForecast: {
            description: "Новая информация или обучение открывает перспективы.",
            strongPoint: "Любознательность",
            watchOut: "Поверхностность",
            tipOfTheDay: "Углубите свои знания в профессии."
        },
        healthForecast: {
            description: "Активный ум требует физической разгрузки.",
            strongPoint: "Бдительность",
            watchOut: "Нервозность",
            tipOfTheDay: "Балансируйте умственную нагрузку физическими упражнениями."
        },
        image: "page_swords.png"
    },

    // Knight of Swords
    {
        name: "Рыцарь Мечей",
        description: "Стремительность, амбиции и острый ум в действии. Быстрый и решительный.",
        loveForecast: {
            description: "Стремительный роман или резкие перемены в отношениях.",
            strongPoint: "Решительность",
            watchOut: "Бестактность",
            tipOfTheDay: "Думайте, прежде чем говорить."
        },
        careerForecast: {
            description: "Быстрые и решительные действия приведут к успеху.",
            strongPoint: "Скорость",
            watchOut: "Грубость",
            tipOfTheDay: "Действуйте быстро, но с уважением к другим."
        },
        healthForecast: {
            description: "Высокий темп жизни требует соответствующей поддержки.",
            strongPoint: "Адреналин",
            watchOut: "Травмы от спешки",
            tipOfTheDay: "Не забывайте о безопасности при активных занятиях."
        },
        image: "knight_swords.png"
    },

    // Queen of Swords
    {
        name: "Королева Мечей",
        description: "Ясный ум, независимость и справедливость. Мудрая и проницательная женщина.",
        loveForecast: {
            description: "Независимость и четкие границы в отношениях.",
            strongPoint: "Проницательность",
            watchOut: "Холодность",
            tipOfTheDay: "Устанавливайте здоровые границы с любовью."
        },
        careerForecast: {
            description: "Острый ум и честность — ваши главные козыри.",
            strongPoint: "Справедливость",
            watchOut: "Резкость",
            tipOfTheDay: "Говорите правду, но с дипломатией."
        },
        healthForecast: {
            description: "Ясность ума помогает принимать верные решения о здоровье.",
            strongPoint: "Логика",
            watchOut: "Подавление эмоций",
            tipOfTheDay: "Не забывайте о душевном здоровье."
        },
        image: "queen_swords.png"
    },

    // King of Swords
    {
        name: "Король Мечей",
        description: "Интеллектуальная сила, авторитет и объективность. Справедливый и мудрый правитель.",
        loveForecast: {
            description: "Логичный подход к отношениям. Не забывайте о чувствах.",
            strongPoint: "Честность",
            watchOut: "Бесчувственность",
            tipOfTheDay: "Слушайте не только разум, но и сердце."
        },
        careerForecast: {
            description: "Интеллектуальное лидерство и стратегическое мышление.",
            strongPoint: "Стратегия",
            watchOut: "Авторитарность",
            tipOfTheDay: "Принимайте решения на основе фактов."
        },
        healthForecast: {
            description: "Рациональный подход к здоровью приносит результаты.",
            strongPoint: "Дисциплина ума",
            watchOut: "Игнорирование интуиции тела",
            tipOfTheDay: "Подходите к здоровью системно и осознанно."
        },
        image: "king_swords.png"
    },

    // ============================================================
    // MINOR ARCANA — PENTACLES (Пентакли) — 14 cards
    // ============================================================

    // Ace of Pentacles
    {
        name: "Туз Пентаклей",
        description: "Новая финансовая возможность, материальное начало и изобилие. Семя процветания.",
        loveForecast: {
            description: "Стабильные и надежные отношения. Материальная основа для пары.",
            strongPoint: "Стабильность",
            watchOut: "Меркантильность",
            tipOfTheDay: "Инвестируйте в отношения, а не только в материальное."
        },
        careerForecast: {
            description: "Новая работа, проект или источник дохода появляется на горизонте.",
            strongPoint: "Возможность",
            watchOut: "Жадность",
            tipOfTheDay: "Используйте финансовую возможность, которая открывается."
        },
        healthForecast: {
            description: "Инвестиции в здоровье окупятся сторицей.",
            strongPoint: "Основа",
            watchOut: "Скупость на здоровье",
            tipOfTheDay: "Инвестируйте в качественное питание и абонемент в зал."
        },
        image: "ace_pentacles.png"
    },

    // Two of Pentacles
    {
        name: "Двойка Пентаклей",
        description: "Баланс, адаптация и жонглирование задачами. Гибкость — ключ к успеху.",
        loveForecast: {
            description: "Баланс между отношениями и другими сферами жизни.",
            strongPoint: "Гибкость",
            watchOut: "Непостоянство",
            tipOfTheDay: "Найдите баланс между работой и личной жизнью."
        },
        careerForecast: {
            description: "Жонглирование несколькими проектами одновременно.",
            strongPoint: "Многозадачность",
            watchOut: "Рассеянность",
            tipOfTheDay: "Расставьте приоритеты между задачами."
        },
        healthForecast: {
            description: "Тело нуждается в балансе нагрузки и отдыха.",
            strongPoint: "Адаптивность",
            watchOut: "Дисбаланс",
            tipOfTheDay: "Балансируйте между активностью и восстановлением."
        },
        image: "two_pentacles.png"
    },

    // Three of Pentacles
    {
        name: "Тройка Пентаклей",
        description: "Мастерство, командная работа и планирование. Совместный труд создает шедевры.",
        loveForecast: {
            description: "Совместное построение отношений. Работа в команде.",
            strongPoint: "Сотрудничество",
            watchOut: "Перфекционизм",
            tipOfTheDay: "Стройте отношения вместе, как мастера строят собор."
        },
        careerForecast: {
            description: "Качественная командная работа приносит признание.",
            strongPoint: "Мастерство",
            watchOut: "Критиканство",
            tipOfTheDay: "Сотрудничайте с профессионалами для лучшего результата."
        },
        healthForecast: {
            description: "Комплексный подход к здоровью дает лучший результат.",
            strongPoint: "Системность",
            watchOut: "Перенагрузка",
            tipOfTheDay: "Обратитесь к команде специалистов для комплексного подхода."
        },
        image: "three_pentacles.png"
    },

    // Four of Pentacles
    {
        name: "Четверка Пентаклей",
        description: "Накопление, контроль и материальная безопасность. Но не превращайтесь в скупца.",
        loveForecast: {
            description: "Собственничество и контроль в отношениях.",
            strongPoint: "Безопасность",
            watchOut: "Собственничество",
            tipOfTheDay: "Любовь нельзя удержать, ее можно только дарить."
        },
        careerForecast: {
            description: "Финансовая стабильность, но страх потерять нажитое.",
            strongPoint: "Бережливость",
            watchOut: "Скупость",
            tipOfTheDay: "Сохраняйте, но не бойтесь инвестировать в рост."
        },
        healthForecast: {
            description: "Зажатость в теле отражает зажатость в мыслях.",
            strongPoint: "Стабильность",
            watchOut: "Напряжение",
            tipOfTheDay: "Расслабьтесь и отпустите контроль. Попробуйте массаж."
        },
        image: "four_pentacles.png"
    },

    // Five of Pentacles
    {
        name: "Пятерка Пентаклей",
        description: "Финансовые трудности, чувство отверженности и холод. Но помощь рядом.",
        loveForecast: {
            description: "Чувство одиночества или отвержения. Но вы не одиноки.",
            strongPoint: "Стойкость",
            watchOut: "Изоляция",
            tipOfTheDay: "Попросите помощи — гордость не должна стоять на пути."
        },
        careerForecast: {
            description: "Финансовые трудности или потеря работы.",
            strongPoint: "Выносливость",
            watchOut: "Отчаяние",
            tipOfTheDay: "Ищите поддержку и новые возможности."
        },
        healthForecast: {
            description: "Недомогание или слабость. Организму нужна поддержка.",
            strongPoint: "Воля к жизни",
            watchOut: "Пренебрежение лечением",
            tipOfTheDay: "Обратитесь за помощью, не стесняйтесь."
        },
        image: "five_pentacles.png"
    },

    // Six of Pentacles
    {
        name: "Шестерка Пентаклей",
        description: "Щедрость, помощь и баланс давать-получать. Делитесь и получайте.",
        loveForecast: {
            description: "Равноценный обмен в отношениях. Щедрость укрепляет связь.",
            strongPoint: "Щедрость",
            watchOut: "Неравенство",
            tipOfTheDay: "Проявите щедрость к партнеру без ожидания чего-то взамен."
        },
        careerForecast: {
            description: "Финансовая помощь или повышение. Справедливое вознаграждение.",
            strongPoint: "Справедливость",
            watchOut: "Зависимость",
            tipOfTheDay: "Помогайте тем, кто нуждается, — это вернется сторицей."
        },
        healthForecast: {
            description: "Баланс отдачи и восполнения энергии.",
            strongPoint: "Равновесие",
            watchOut: "Самоотдача",
            tipOfTheDay: "Давайте и получайте энергию в равной мере."
        },
        image: "six_pentacles.png"
    },

    // Seven of Pentacles
    {
        name: "Семерка Пентаклей",
        description: "Терпение, оценка результатов и ожидание урожая. Семена посажены — ждите плодов.",
        loveForecast: {
            description: "Время оценить, куда движутся ваши отношения.",
            strongPoint: "Терпение",
            watchOut: "Нетерпение",
            tipOfTheDay: "Дайте отношениям время вырасти."
        },
        careerForecast: {
            description: "Время подвести промежуточные итоги. Инвестиции начинают окупаться.",
            strongPoint: "Оценка",
            watchOut: "Разочарование",
            tipOfTheDay: "Проанализируйте результаты и скорректируйте стратегию."
        },
        healthForecast: {
            description: "Результаты здорового образа жизни проявятся со временем.",
            strongPoint: "Долгосрочность",
            watchOut: "Нетерпение",
            tipOfTheDay: "Продолжайте придерживаться здоровых привычек."
        },
        image: "seven_pentacles.png"
    },

    // Eight of Pentacles
    {
        name: "Восьмерка Пентаклей",
        description: "Усердие, обучение и оттачивание мастерства. Трудолюбие ведет к совершенству.",
        loveForecast: {
            description: "Работа над отношениями приносит результат. Учитесь друг у друга.",
            strongPoint: "Старание",
            watchOut: "Трудоголизм",
            tipOfTheDay: "Уделите время улучшению отношений."
        },
        careerForecast: {
            description: "Углубление навыков и совершенствование мастерства.",
            strongPoint: "Трудолюбие",
            watchOut: "Зацикленность",
            tipOfTheDay: "Пройдите курс повышения квалификации."
        },
        healthForecast: {
            description: "Регулярные тренировки дают видимый результат.",
            strongPoint: "Дисциплина",
            watchOut: "Монотонность",
            tipOfTheDay: "Оттачивайте технику упражнений для лучших результатов."
        },
        image: "eight_pentacles.png"
    },

    // Nine of Pentacles
    {
        name: "Девятка Пентаклей",
        description: "Роскошь, самодостаточность и материальный комфорт. Наслаждайтесь плодами труда.",
        loveForecast: {
            description: "Самодостаточность делает вас привлекательным. Цените свою независимость.",
            strongPoint: "Независимость",
            watchOut: "Одиночество",
            tipOfTheDay: "Любите себя — это основа для любви к другим."
        },
        careerForecast: {
            description: "Финансовая независимость и комфорт достигнуты.",
            strongPoint: "Достаток",
            watchOut: "Самоизоляция",
            tipOfTheDay: "Наслаждайтесь достигнутым комфортом."
        },
        healthForecast: {
            description: "Вы можете позволить себе лучший уход за здоровьем.",
            strongPoint: "Качество жизни",
            watchOut: "Расточительность",
            tipOfTheDay: "Инвестируйте в премиальный уход за собой."
        },
        image: "nine_pentacles.png"
    },

    // Ten of Pentacles
    {
        name: "Десятка Пентаклей",
        description: "Семейное богатство, наследие и долгосрочный успех. Основа для поколений.",
        loveForecast: {
            description: "Крепкая семья и долгосрочные отношения. Наследие любви.",
            strongPoint: "Наследие",
            watchOut: "Материализм",
            tipOfTheDay: "Создавайте общие семейные традиции."
        },
        careerForecast: {
            description: "Долгосрочный финансовый успех и стабильность.",
            strongPoint: "Процветание",
            watchOut: "Застой",
            tipOfTheDay: "Думайте о долгосрочных инвестициях и планах."
        },
        healthForecast: {
            description: "Генетическое здоровье и семейные традиции заботы о себе.",
            strongPoint: "Устойчивость",
            watchOut: "Наследственные заболевания",
            tipOfTheDay: "Изучите историю здоровья вашей семьи."
        },
        image: "ten_pentacles.png"
    },

    // Page of Pentacles
    {
        name: "Паж Пентаклей",
        description: "Новое начинание, обучение и практичность. Молодой ученик с большими планами.",
        loveForecast: {
            description: "Серьезный и надежный поклонник. Практичный подход к любви.",
            strongPoint: "Надежность",
            watchOut: "Скучность",
            tipOfTheDay: "Покажите свою серьезность и надежность в чувствах."
        },
        careerForecast: {
            description: "Новая возможность для обучения или стажировки.",
            strongPoint: "Усидчивость",
            watchOut: "Неопытность",
            tipOfTheDay: "Начните изучать новый навык или профессию."
        },
        healthForecast: {
            description: "Начните изучать правильное питание и здоровый образ жизни.",
            strongPoint: "Обучаемость",
            watchOut: "Лень",
            tipOfTheDay: "Изучите основы правильного питания."
        },
        image: "page_pentacles.png"
    },

    // Knight of Pentacles
    {
        name: "Рыцарь Пентаклей",
        description: "Надежность, трудолюбие и методичность. Медленно, но верно к цели.",
        loveForecast: {
            description: "Надежный и верный партнер. Стабильные и предсказуемые отношения.",
            strongPoint: "Верность",
            watchOut: "Предсказуемость",
            tipOfTheDay: "Покажите свою преданность через ежедневные поступки."
        },
        careerForecast: {
            description: "Упорный и методичный труд приносит стабильный результат.",
            strongPoint: "Надежность",
            watchOut: "Медлительность",
            tipOfTheDay: "Работайте систематично и не пропускайте деталей."
        },
        healthForecast: {
            description: "Стабильный и методичный подход к здоровью.",
            strongPoint: "Постоянство",
            watchOut: "Рутина",
            tipOfTheDay: "Придерживайтесь привычного режима тренировок."
        },
        image: "knight_pentacles.png"
    },

    // Queen of Pentacles
    {
        name: "Королева Пентаклей",
        description: "Практичность, изобилие и домашний уют. Заботливая и щедрая душа.",
        loveForecast: {
            description: "Теплый домашний очаг и заботливый партнер.",
            strongPoint: "Заботливость",
            watchOut: "Потеря себя",
            tipOfTheDay: "Создайте уютную атмосферу для двоих."
        },
        careerForecast: {
            description: "Практичный подход к бизнесу приносит стабильный доход.",
            strongPoint: "Практичность",
            watchOut: "Перфекционизм",
            tipOfTheDay: "Создайте комфортное рабочее пространство."
        },
        healthForecast: {
            description: "Забота о теле через правильное питание и комфорт.",
            strongPoint: "Питание",
            watchOut: "Переедание",
            tipOfTheDay: "Приготовьте полезное и вкусное блюдо."
        },
        image: "queen_pentacles.png"
    },

    // King of Pentacles
    {
        name: "Король Пентаклей",
        description: "Финансовый успех, изобилие и мудрое управление ресурсами. Царь процветания.",
        loveForecast: {
            description: "Надежный и обеспеченный партнер. Материальная забота.",
            strongPoint: "Обеспеченность",
            watchOut: "Материализм",
            tipOfTheDay: "Любовь важнее денег — помните об этом."
        },
        careerForecast: {
            description: "Вершина финансового успеха. Мудрое управление бизнесом.",
            strongPoint: "Богатство",
            watchOut: "Жадность",
            tipOfTheDay: "Управляйте финансами мудро и щедро."
        },
        healthForecast: {
            description: "Инвестиции в здоровье дают великолепные результаты.",
            strongPoint: "Ресурсы",
            watchOut: "Малоподвижность",
            tipOfTheDay: "Инвестируйте в лучшего тренера или диетолога."
        },
        image: "king_pentacles.png"
    }
];

const seedTarotCards = async () => {
    try {
        await TarotCard.deleteMany({});
        console.log('Cleared existing tarot cards.');

        await TarotCard.insertMany(tarotData);
        console.log(`Successfully seeded ${tarotData.length} tarot cards.`);
        console.log('Breakdown:');
        console.log('  - 22 Major Arcana');
        console.log('  - 14 Wands (Жезлы)');
        console.log('  - 14 Cups (Кубки)');
        console.log('  - 14 Swords (Мечи)');
        console.log('  - 14 Pentacles (Пентакли)');
        console.log(`  Total: ${tarotData.length} cards`);

        process.exit(0);
    } catch (err) {
        console.error('Error seeding tarot cards:', err);
        process.exit(1);
    }
};

seedTarotCards();
