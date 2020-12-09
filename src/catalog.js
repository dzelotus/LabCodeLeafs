/* eslint-disable global-require */
const diseaseData = [
	{
		id: 1,
		diseaseName: 'Бурая пятнистость',
		synonym: 'филлостиктоз, brown leaf spot',
		pathogen: 'Mycosphaerella pomi (Pass.) Lindau',
		aboutDisease:
			'Заражение различных органов яблони может происходить в течение всего вегетационного сезона. На поражённых листьях появляются коричнево-бурые пятна округлой, овальной или угловатой неправильной формы, диаметром до 5 мм, иногда крупнее. В центре пятно светлее, по краям – темнее. Развитию заболевания способствуют повышенная влажность и загущенные насаждения.',
		harmfulness:
			'Заболевание вызывает преждевременное пожелтение и опадение листьев. В период максимального развития заболевания отмечается резкий спад интенсивности фотосинтеза больных растений.',
		geography:
			'Заболевание распространено в России (Чернозёмная зона, Кавказ), Абхазии, Европе (в т. ч. Молдове, Украине).',
		previewImage: require('../assets/disease_photos/a1.png'),
		images: require('../assets/disease_photos/a2.jpg'),
	},
	{
		id: 2,
		diseaseName: 'Грушевый клоп',
		synonym: 'Stephanites pyri F., pear lace bug',
		pathogen: '',
		aboutDisease:
			'Мелкое насекомое чёрного цвета, длиной 3–5 мм. У взрослого насекомого крупные ажурные крылья, сложенные плоско на спине. Насекомое высасывает соки, в результате происходит обесцвечивание, засыхание и опадение листьев, а в связи с этим недоразвитие плодов, ослабление прироста и процесса закладки плодовых почек для урожая будущего года. На повреждённых листьях имеются чёрные пятна, представляющие собой засохшие экскременты клопов. Зимуют взрослые клопы под опавшими листьями, в щелях коры и других защищённых местах. Весной с наступлением тёплых дней они появляются в кронах деревьев и начинают питаться, высасывая соки из листьев.',
		harmfulness:
			'Повреждает главным образом яблоню, затем грушу, айву, иногда косточковые породы.',
		geography:
			'Распространён в южных районах России, в Абхазии, Крыму, на Кавказе, в Средней Азии, Северной Африке, Европе (в т. ч. в Украине, Молдове).',
		previewImage: require('../assets/disease_photos/b1.jpg'),
		images: require('../assets/disease_photos/b2.png'),
	},
	{
		id: 3,
		diseaseName: 'Белая цикадка',
		synonym: 'Metcalfa pruinosa Say, grape leafhopper',
		pathogen: '',
		aboutDisease:
			'Взрослые насекомые среднего размера, длина тела до 12 мм. Личинки и имаго питаются клеточным соком листьев, вызывая разрушение хлорофилла. Вместе со слюной идет выделение токсинов. Растения покрываются сладкими выделениями (падью) вредителя и ослабляются. Побеги растений покрываются белым пушистым восковым налетом, среди которого располагаются сначала яйцекладки, а затем белые личинки вредителя. Листья и побеги деформируются, на них образуются желтоватые или беловатые пятна, развивается чернь.',
		harmfulness:
			'Полифаг. Повреждает 330 видов растений из 78 семейств. При поражении плодовых может спровоцировать опадение незрелых плодов, а при сильной степени повреждения плоды могут вообще не образоваться.',
		geography:
			'В настоящее время встречается на побережье и в равнинной части Краснодарского края повсеместно. В 2015–2016 гг. во влажных субтропиках России и Абхазии отмечена вспышка массового размножения. Естественный ареал охватывает Канаду, США, Бермуды.',
		previewImage: require('../assets/disease_photos/c1.png'),
		images: require('../assets/disease_photos/c2.jpg'),
	},
	{
		id: 4,
		diseaseName: 'Филлоксера',
		synonym: 'Филлоксера виноградная, виноградная тля, leaf louse',
		pathogen: '',
		aboutDisease:
			'Филлоксера виноградная (виноградная тля) – это мелкое насекомое, размером от 0,25 до 2,25 мм, которое едва различимо невооруженным глазом, имеет желто-зеленый окрас. Она повреждает все части куста: побеги, листья, усики, подземный штамб, корневую систему. Тля может размножаться без оплодотворения, благодаря чему быстро распространяется и мигрирует на другие виноградные кусты. Это сосущее насекомое хоботком прокалывает часть растения, где при этом появляется деформированное образование, в котором развиваются личинки. Существует 4 вида этого паразита, каждый из которых имеет свои особенности и повреждает отдельную часть растения: корневая; крылатая; половая; листовая.',
		harmfulness:
			'Филлоксера повреждает все части винограда. На корнях в местах питания образуются вздутия и желваки, развиваются некротические процессы. Результатом может стать полная гибель виноградников, особенно молодых. На листьях образуются галлы, листовые пластинки деформируются и опадают, однако их повреждение не сказывается на качестве продукции и урожайности.',
		geography:
			'Ареал распространения филлоксеры охватывает все районы виноградарства в Европе, Азии, Африке, Северной Америке и России. ',
		previewImage: require('../assets/disease_photos/d1.jpg'),
		images: require('../assets/disease_photos/d2.jpg'),
	},
	{
		id: 5,
		diseaseName: 'Цитрусовая минирующая моль ',
		synonym: 'Phyllocnistis citrella Stainton, leaf miner',
		pathogen: '',
		aboutDisease:
			'Повреждает листья. Родившиеся гусеницы вгрызаются в лист, прячутся в жилку листа, потом скрыто вредят, выедая лист изнутри, образуя прозрачные мины. При сильном заселении листья деформируются.',
		harmfulness:
			'Повреждает цитрусовые (больше сорта, дающие семена), эвкалипты, ивы, жасмин. Главный источник распространения вредителя – посадочный материал. Период вредоносности – со второй декады августа по ноябрь (в закрытом грунте круглогодично).',
		geography:
			'На сегодняшний день распространена в субтропиках России и Абхазии, вспышки массового размножения цитрусовой минирующей моли наблюдались в регионе в 1999–2002, 2006–2009 гг. Очередной подъём численности был отмечен в 2016–2017 гг., чаще на завозимых из других регионов саженцах.',
		previewImage: require('../assets/disease_photos/e1.png'),
		images: require('../assets/disease_photos/e2.png'),
	},
	{
		id: 6,
		diseaseName: 'Шерстистая белокрылка',
		synonym: 'Aleurothrixus floccosus, woolly whitefly',
		pathogen: '',
		aboutDisease:
			'Обитают, как правило, во влажных тенистых местах, особенно часто встречаются на нижней стороне листьев растений. Личинки всех возрастов питаются клеточным соком растений. На зиму остаются в грунте (под листьями, травой, комками земли) до наступления весны.',
		harmfulness:
			'Белокрылки – полифаги, а потому их обнаружение на растениях само по себе требует принятия ряда профилактических и истребительных мер. Угрозу представляют личинки белокрылок, питающиеся соками растений. Помимо этого, личинки выделяют сахароподобные продукты жизнедеятельности, на которых впоследствии поселяется гриб кладоспориум, приводящий к снижению фотосинтетической способности, вплоть до гибели растения.',
		geography:
			'Белокрылки – теплолюбивые насекомые, тяготеющие к жаркому влажному климату. В естественных условиях наибольшей численности и видового разнообразия достигают в тропиках и субтропической зоне. Однако в искусственно поддерживаемых условиях парников, теплиц и оранжерей встречаются повсеместно. ',
		previewImage: require('../assets/disease_photos/f1.png'),
		images: require('../assets/disease_photos/f2.jpg'),
	},
	{
		id: 7,
		diseaseName: 'Инжировая огневка',
		synonym: 'Cadra figulilella, raisin moth',
		pathogen: '',
		aboutDisease:
			'Размеры бабочек при раскрытых своеобразных коричневых крыльев достигают 16–18 мм. Зимует в стадии куколки. Молодые гусеницы (1 и 2 возраста) вначале питаются на нижней стороне листа, соскабливая его мякоть, причем молодые и взрослые гусеницы бывают скрыты паутинным сплетение, под которым они проводят свое развитие. Подросшие гусеницы (3 и 4 возрастов) переходят на верхнюю сторону листа, где продолжают свое развитие до окукливания.  В период своего развития одна гусеница способна повредить 4-5 листьев и кроме того, повреждает плоды, вгрызаясь в их мякоть или соскабливая еще зеленую кожицу. Поврежденные плоды загнивают и опадают. Закончив питание, взрослая гусеница выбирает неповрежденный или мало поврежденные лист, сгибает его край, скрепив место сгиба паутинкой, а внутри сгиба сплетает плотный паутинный кокон белого цвета и в нем окукливается.',
		harmfulness:
			'монофаг, является основным вредителем инжира. Сильно повреждает листья и плодоэлементы.',
		geography:
			'Европейская часть России, Кавказ и Закавказье (Армения, Азербайджан), Средняя Азия (Копет-Даг).',
		previewImage: require('../assets/disease_photos/g1.jpg'),
		images: require('../assets/disease_photos/g2.jpg'),
	},
	{
		id: 8,
		diseaseName: 'Долгоносики',
		synonym: 'Otiorhynchus sp., leaf weevils',
		pathogen: '',
		aboutDisease:
			'очень многочисленная и разнообразная группа жуков, насчитывающая 60 тыс. видов, а по некоторым данным количество представителей семейства может достигать 70 тысяч. Свое русское название насекомые получили благодаря удлиненной форме головы, напоминающей хобот слона. В зависимости от длины так называемого «хоботка», долгоносики делятся на короткохоботных и длиннохоботных, которые различаются не только по морфологическому строению, но и по эколого-биологическим особенностям. Многие долгоносики являются вредителями сельского и лесного хозяйства.',
		harmfulness:
			'Связи их с растениями очень разнообразны. Трудно найти вид растения, с которым не были бы связаны виды долгоносиков. Большинство долгоносиков развивается за счёт тканей внутри растений. Реже личинки питаются снаружи частями листа или цветка (Hyperini, Cionini). Многие развиваются в почве, питаясь корнями растений, реже — опадом. Немногие питаются гниющей древесиной (Cossoninae). Значительное большинство видов связано с травянистой растительностью, большинство с двудольными. Связи с однодольными немного меньше, со споровыми ещё меньше.',
		geography:
			'Распространены повсеместно, кроме крайнего севера, высокогорных районов и пустынь. Наибольшей численности и видового разнообразия достигают в тропической зоне.',
		previewImage: require('../assets/disease_photos/h1.jpg'),
		images: require('../assets/disease_photos/h2.jpg'),
	},
];

export default diseaseData;
