/* ============ أذكار الصلاة - مع مسبحة تفاعلية ============ */

const SALAH_ATHKAR_DATA = [
  {
    category: "📢 نص الأذان",
    items: [
      { id: "adhan_text", text: "اللهُ أَكْبَرُ، اللهُ أَكْبَرُ\nاللهُ أَكْبَرُ، اللهُ أَكْبَرُ\nأَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ\nأَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ\nأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللهِ\nأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللهِ\nحَيَّ عَلَى الصَّلَاةِ\nحَيَّ عَلَى الصَّلَاةِ\nحَيَّ عَلَى الْفَلَاحِ\nحَيَّ عَلَى الْفَلَاحِ\nاللهُ أَكْبَرُ، اللهُ أَكْبَرُ\nلَا إِلَهَ إِلَّا اللهُ", count: 1, condition: "صيغة الأذان", virtue: "نص الأذان الكامل", source: "متفق عليه" },
      { id: "fajr_adhan", text: "اللهُ أَكْبَرُ، اللهُ أَكْبَرُ\nاللهُ أَكْبَرُ، اللهُ أَكْبَرُ\nأَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ\nأَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ\nأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللهِ\nأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللهِ\nحَيَّ عَلَى الصَّلَاةِ\nحَيَّ عَلَى الصَّلَاةِ\nحَيَّ عَلَى الْفَلَاحِ\nحَيَّ عَلَى الْفَلَاحِ\nالصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ\nالصَّلَاةُ خَيْرٌ مِنَ النَّوْمِ\nاللهُ أَكْبَرُ، اللهُ أَكْبَرُ\nلَا إِلَهَ إِلَّا اللهُ", count: 1, condition: "صيغة أذان الفجر", virtue: "زيادة الأذان في الفجر", source: "متفق عليه" },
      { id: "iqama_text", text: "اللهُ أَكْبَرُ، اللهُ أَكْبَرُ\nأَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللهُ\nأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللهِ\nحَيَّ عَلَى الصَّلَاةِ\nحَيَّ عَلَى الْفَلَاحِ\nقَدْ قَامَتِ الصَّلَاةُ\nقَدْ قَامَتِ الصَّلَاةُ\nاللهُ أَكْبَرُ، اللهُ أَكْبَرُ\nلَا إِلَهَ إِلَّا اللهُ", count: 1, condition: "صيغة الإقامة", virtue: "نص الإقامة", source: "متفق عليه" }
    ]
  },
  {
    category: "🕌 أذكار عند سماع الأذان",
    items: [
      { id: "adhan_1", text: "يَقُولُ مِثْلَ مَا يَقُولُ الْمُؤَذِّنُ، إِلَّا فِي «حَيَّ عَلَى الصَّلَاةِ» وَ«حَيَّ عَلَى الْفَلَاحِ» فَيَقُولُ: لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", count: 1, condition: "عند سماع الأذان", virtue: "من قال ذلك موقناً به دخل الجنة", source: "متفق عليه" },
      { id: "adhan_2", text: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ، رَضِيتُ بِاللَّهِ رَبًّا، وَبِمُحَمَّدٍ رَسُولًا، وَبِالْإِسْلَامِ دِينًا", count: 1, condition: "عند سماع الأذان", virtue: "غُفِرَ لَهُ ذَنْبُهُ", source: "رواه مسلم" },
      { id: "adhan_3", text: "إِذَا سَمِعْتُمُ النِّدَاءَ فَقُولُوا مِثْلَ مَا يَقُولُ، ثُمَّ صَلُّوا عَلَيَّ، فَإِنَّهُ مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا، ثُمَّ سَلُوا اللَّهَ لِيَ الْوَسِيلَةَ، فَإِنَّهَا مَنْزِلَةٌ فِي الْجَنَّةِ لَا تَنْبَغِي إِلَّا لِعَبْدٍ مِنْ عِبَادِ اللَّهِ، وَأَرْجُو أَنْ أَكُونَ أَنَا هُوَ، فَمَنْ سَأَلَ لِيَ الْوَسِيلَةَ حَلَّتْ لَهُ الشَّفَاعَةُ", count: 1, condition: "عند سماع الأذان", virtue: "حَلَّتْ لَهُ الشَّفَاعَةُ", source: "رواه مسلم" },
      { id: "adhan_4", text: "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ", count: 1, condition: "عند سماع الأذان", virtue: "حَلَّتْ لَهُ شَفَاعَتِي يَوْمَ الْقِيَامَةِ", source: "رواه البخاري" }
    ]
  },
  {
    category: "🤲 ما يقال بعد الأذان",
    items: [
      { id: "after_adhan_1", text: "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ", count: 1, condition: "بعد الأذان", virtue: "الصلاة على النبي ﷺ", source: "مستحب" },
      { id: "after_adhan_2", text: "اللَّهُمَّ رَبَّ هَذِهِ الدَّعْوَةِ التَّامَّةِ، وَالصَّلَاةِ الْقَائِمَةِ، آتِ مُحَمَّدًا الْوَسِيلَةَ وَالْفَضِيلَةَ، وَابْعَثْهُ مَقَامًا مَحْمُودًا الَّذِي وَعَدْتَهُ، إِنَّكَ لَا تُخْلِفُ الْمِيعَادَ", count: 1, condition: "بعد الأذان", virtue: "دعاء بعد الأذان", source: "متفق عليه" }
    ]
  },
  {
    category: "⏳ ما يقال بين الأذان والإقامة",
    items: [
      { id: "between_adhan", text: "الدُّعَاءُ لَا يُرَدُّ بَيْنَ الْأَذَانِ وَالْإِقَامَةِ", count: 1, condition: "بين الأذان والإقامة", virtue: "ادعُ بما شئت من خير الدنيا والآخرة", source: "رواه الترمذي وأبو داود" },
      { id: "between_adhan_2", text: "إِنَّ الدُّعَاءَ لَا يُرَدُّ بَيْنَ الْأَذَانِ وَالْإِقَامَةِ فَادْعُوا", count: 1, condition: "بين الأذان والإقامة", virtue: "وقت مستجاب للدعاء", source: "رواه أحمد" }
    ]
  },
  {
    category: "💧 أذكار الوضوء",
    items: [
      { id: "wudu_1", text: "بِسْمِ اللَّهِ", count: 1, condition: "في بداية الوضوء", virtue: "لا وضوء لمن لم يذكر اسم الله عليه", source: "رواه أبو داود" },
      { id: "wudu_2", text: "أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ", count: 1, condition: "بعد الفراغ من الوضوء", virtue: "فُتِحَتْ لَهُ أَبْوَابُ الْجَنَّةِ الثَّمَانِيَةُ", source: "رواه مسلم" }
    ]
  },
  {
    category: "🕋 أذكار دخول المسجد",
    items: [
      { id: "mosque_in", text: "بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", count: 1, condition: "عند الدخول", virtue: "دعاء دخول المسجد", source: "رواه مسلم" },
      { id: "mosque_out", text: "بِسْمِ اللَّهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَى رَسُولِ اللَّهِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ", count: 1, condition: "عند الخروج", virtue: "دعاء الخروج من المسجد", source: "رواه مسلم" }
    ]
  },
  {
    category: "🙏 أدعية الركوع",
    items: [
      { id: "ruku_1", text: "سُبْحَانَ رَبِّيَ الْعَظِيمِ", count: 3, condition: "في الركوع", virtue: "يقال ثلاث مرات أو أكثر", source: "رواه مسلم" },
      { id: "ruku_2", text: "سُبْحَانَ رَبِّيَ الْعَظِيمِ وَبِحَمْدِهِ", count: 3, condition: "في الركوع", virtue: "يقال ثلاث مرات", source: "رواه أبو داود" },
      { id: "ruku_3", text: "سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ، اللَّهُمَّ اغْفِرْ لِي", count: 1, condition: "في الركوع", virtue: "دعاء الركوع", source: "متفق عليه" },
      { id: "ruku_4", text: "سُبُّوحٌ، قُدُّوسٌ، رَبُّ الْمَلَائِكَةِ وَالرُّوحِ", count: 1, condition: "في الركوع", virtue: "تسبيح الركوع", source: "رواه مسلم" },
      { id: "ruku_5", text: "سُبْحَانَ ذِي الْجَبَرُوتِ، وَالْمَلَكُوتِ، وَالْكِبْرِيَاءِ، وَالْعَظَمَةِ", count: 1, condition: "في الركوع", virtue: "تسبيح الركوع", source: "رواه أبو داود" },
      { id: "ruku_6", text: "اللَّهُمَّ لَكَ رَكَعْتُ، وَبِكَ آمَنْتُ، وَلَكَ أَسْلَمْتُ، خَشَعَ لَكَ سَمْعِي وَبَصَرِي، وَمُخِّي وَعَظْمِي وَعَصَبِي", count: 1, condition: "في الركوع", virtue: "دعاء الركوع", source: "رواه مسلم" }
    ]
  },
  {
    category: "🧍 أدعية الرفع من الركوع",
    items: [
      { id: "rise_1", text: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ", count: 1, condition: "عند الرفع من الركوع", virtue: "يقولها الإمام والمنفرد", source: "متفق عليه" },
      { id: "rise_2", text: "رَبَّنَا وَلَكَ الْحَمْدُ، حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ", count: 1, condition: "بعد الرفع من الركوع", virtue: "ملء السماوات والأرض", source: "متفق عليه" },
      { id: "rise_3", text: "اللَّهُمَّ رَبَّنَا لَكَ الْحَمْدُ مِلْءَ السَّمَاوَاتِ وَمِلْءَ الْأَرْضِ، وَمِلْءَ مَا شِئْتَ مِنْ شَيْءٍ بَعْدُ، أَهْلَ الثَّنَاءِ وَالْمَجْدِ، أَحَقُّ مَا قَالَ الْعَبْدُ، وَكُلُّنَا لَكَ عَبْدٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ", count: 1, condition: "بعد الرفع من الركوع", virtue: "دعاء الرفع", source: "رواه مسلم" },
      { id: "rise_4", text: "اللَّهُمَّ طَهِّرْنِي بِالثَّلْجِ وَالْبَرَدِ وَالْمَاءِ الْبَارِدِ، اللَّهُمَّ طَهِّرْنِي مِنَ الذُّنُوبِ وَالْخَطَايَا كَمَا يُنَقَّى الثَّوْبُ الْأَبْيَضُ مِنَ الْوَسَخِ", count: 1, condition: "بعد الرفع من الركوع", virtue: "دعاء التطهير", source: "رواه البخاري" }
    ]
  },
  {
    category: "🙇 أدعية السجود",
    items: [
      { id: "sujud_1", text: "سُبْحَانَ رَبِّيَ الْأَعْلَى", count: 3, condition: "في السجود", virtue: "يقال ثلاث مرات أو أكثر", source: "رواه مسلم" },
      { id: "sujud_2", text: "سُبْحَانَ رَبِّيَ الْأَعْلَى وَبِحَمْدِهِ", count: 3, condition: "في السجود", virtue: "يقال ثلاث مرات", source: "رواه أبو داود" },
      { id: "sujud_3", text: "سُبُّوحٌ قُدُّوسٌ رَبُّ الْمَلَائِكَةِ وَالرُّوحِ", count: 1, condition: "في السجود", virtue: "تسبيح السجود", source: "رواه مسلم" },
      { id: "sujud_4", text: "سُبْحَانَكَ اللَّهُمَّ رَبَّنَا وَبِحَمْدِكَ، اللَّهُمَّ اغْفِرْ لِي", count: 1, condition: "في السجود", virtue: "دعاء السجود", source: "متفق عليه" },
      { id: "sujud_5", text: "سُبْحَانَ ذِي الْجَبَرُوتِ وَالْمَلَكُوتِ وَالْكِبْرِيَاءِ وَالْعَظَمَةِ", count: 1, condition: "في السجود", virtue: "تسبيح السجود", source: "رواه أبو داود" },
      { id: "sujud_6", text: "اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ، وَعَلَانِيَتَهُ وَسِرَّهُ", count: 1, condition: "في السجود", virtue: "دعاء السجود", source: "رواه مسلم" },
      { id: "sujud_7", text: "اللَّهُمَّ لَكَ سَجَدْتُ وَبِكَ آمَنْتُ، وَلَكَ أَسْلَمْتُ، سَجَدَ وَجْهِيَ لِلَّذِي خَلَقَهُ وَصَوَّرَهُ وَشَقَّ سَمْعَهُ وَبَصَرَهُ، تَبَارَكَ اللَّهُ أَحْسَنُ الْخَالِقِينَ", count: 1, condition: "في السجود", virtue: "دعاء السجود", source: "رواه مسلم" },
      { id: "sujud_8", text: "اللَّهُمَّ إِنِّي أَعُوذُ بِرِضَاكَ مِنْ سَخَطِكَ، وَبِمُعَافَاتِكَ مِنْ عُقُوبَتِكَ، وَأَعُوذُ بِكَ مِنْكَ، لَا أُحْصِي ثَنَاءً عَلَيْكَ، أَنْتَ كَمَا أَثْنَيْتَ عَلَى نَفْسِكَ", count: 1, condition: "في السجود", virtue: "دعاء السجود", source: "رواه مسلم" },
      { id: "sujud_9", text: "رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي", count: 1, condition: "في السجود", virtue: "دعاء السجود", source: "رواه أبو داود" },
      { id: "sujud_10", text: "اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا، وَاجْعَلْ فِي سَمْعِي نُورًا، وَاجْعَلْ فِي بَصَرِي نُورًا، وَاجْعَلْ مِنْ تَحْتِي نُورًا، وَاجْعَلْ مِنْ فَوْقِي نُورًا، وَعَنْ يَمِينِي نُورًا، وَعَنْ يَسَارِي نُورًا، وَاجْعَلْ أَمَامِي نُورًا، وَاجْعَلْ خَلْفِي نُورًا، وَأَعْظِمْ لِي نُورًا", count: 1, condition: "في السجود", virtue: "دعاء النور", source: "متفق عليه" }
    ]
  },
  {
    category: "🧎 أدعية الجلوس بين السجدتين",
    items: [
      { id: "between_1", text: "رَبِّ اغْفِرْ لِي، رَبِّ اغْفِرْ لِي", count: 1, condition: "بين السجدتين", virtue: "يقال مراراً", source: "رواه أبو داود" },
      { id: "between_2", text: "اللَّهُمَّ اغْفِرْ لِي، وَارْحَمْنِي، وَاهْدِنِي، وَاجْبُرْنِي، وَعَافِنِي، وَارْزُقْنِي، وَارْفَعْنِي", count: 1, condition: "بين السجدتين", virtue: "الدعاء الشامل", source: "رواه أبو داود" }
    ]
  },
  {
    category: "📖 التشهد",
    items: [
      { id: "tashahhud_1", text: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ", count: 1, condition: "في التشهد الأول والأخير", virtue: "التشهد", source: "متفق عليه" },
      { id: "tashahhud_2", text: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ", count: 1, condition: "في التشهد الأخير", virtue: "الصلاة الإبراهيمية", source: "متفق عليه" }
    ]
  },
  {
    category: "🤲 أدعية قبل السلام",
    items: [
      { id: "before_salam_1", text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، وَمِنْ عَذَابِ جَهَنَّمَ، وَمِنْ فِتْنَةِ الْمَحْيَا وَالْمَمَاتِ، وَمِنْ شَرِّ فِتْنَةِ الْمَسِيحِ الدَّجَّالِ", count: 1, condition: "قبل السلام", virtue: "الاستعاذة من الفتن", source: "متفق عليه" },
      { id: "before_salam_2", text: "اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي، إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ", count: 1, condition: "قبل السلام", virtue: "دعاء المغفرة", source: "متفق عليه" },
      { id: "before_salam_3", text: "اللَّهُمَّ اغْفِرْ لِي مَا قَدَّمْتُ وَمَا أَخَّرْتُ، وَمَا أَسْرَرْتُ وَمَا أَعْلَنْتُ، وَمَا أَسْرَفْتُ، وَمَا أَنْتَ أَعْلَمُ بِهِ مِنِّي، أَنْتَ الْمُقَدِّمُ وَأَنْتَ الْمُؤَخِّرُ، لَا إِلَهَ إِلَّا أَنْتَ", count: 1, condition: "قبل السلام", virtue: "دعاء المغفرة الشامل", source: "رواه مسلم" },
      { id: "before_salam_4", text: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ", count: 1, condition: "قبل السلام", virtue: "دعاء التوفيق", source: "رواه أبو داود" },
      { id: "before_salam_5", text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", count: 1, condition: "قبل السلام", virtue: "دعاء ختام الصلاة", source: "متفق عليه" }
    ]
  },
  {
    category: "✅ أذكار ما بعد السلام",
    items: [
      { id: "after_1", text: "أَسْتَغْفِرُ اللَّهَ", count: 3, condition: "بعد كل صلاة", virtue: "يستغفر ربه ثلاثاً", source: "رواه مسلم" },
      { id: "after_2", text: "اللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ", count: 1, condition: "بعد كل صلاة", virtue: "دعاء بعد السلام", source: "رواه مسلم" },
      { id: "after_3", text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ", count: 1, condition: "بعد كل صلاة", virtue: "دعاء بعد السلام", source: "متفق عليه" },
      { id: "after_4", text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، لَا إِلَهَ إِلَّا اللَّهُ، وَلَا نَعْبُدُ إِلَّا إِيَّاهُ، لَهُ النِّعْمَةُ وَلَهُ الْفَضْلُ وَلَهُ الثَّنَاءُ الْحَسَنُ، لَا إِلَهَ إِلَّا اللَّهُ مُخْلِصِينَ لَهُ الدِّينَ وَلَوْ كَرِهَ الْكَافِرُونَ", count: 1, condition: "بعد كل صلاة", virtue: "دعاء بعد السلام", source: "رواه مسلم" },
      { id: "after_5", text: "سُبْحَانَ اللَّهِ", count: 33, condition: "بعد كل صلاة", virtue: "التسبيح", source: "رواه مسلم" },
      { id: "after_6", text: "الْحَمْدُ لِلَّهِ", count: 33, condition: "بعد كل صلاة", virtue: "التحميد", source: "رواه مسلم" },
      { id: "after_7", text: "اللَّهُ أَكْبَرُ", count: 33, condition: "بعد كل صلاة", virtue: "التكبير", source: "رواه مسلم" },
      { id: "after_8", text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 1, condition: "بعد كل صلاة", virtue: "تمام المائة", source: "رواه مسلم" },
      { id: "after_9", text: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ: قُلْ هُوَ اللَّهُ أَحَدٌ، اللَّهُ الصَّمَدُ، لَمْ يَلِدْ وَلَمْ يُولَدْ، وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ", count: 1, condition: "بعد كل صلاة (3 مرات بعد المغرب والفجر)", virtue: "سورة الإخلاص", source: "رواه أبو داود" },
      { id: "after_10", text: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ: قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، مِنْ شَرِّ مَا خَلَقَ، وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ، وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ، وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ", count: 1, condition: "بعد كل صلاة (3 مرات بعد المغرب والفجر)", virtue: "سورة الفلق", source: "رواه أبو داود" },
      { id: "after_11", text: "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ: قُلْ أَعُوذُ بِرَبِّ النَّاسِ، مَلِكِ النَّاسِ، إِلَهِ النَّاسِ، مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ، الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ، مِنَ الْجِنَّةِ وَالنَّاسِ", count: 1, condition: "بعد كل صلاة (3 مرات بعد المغرب والفجر)", virtue: "سورة الناس", source: "رواه أبو داود" },
      { id: "after_12", text: "آيَةُ الْكُرْسِيِّ: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ، لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ، مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ، يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ، وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ، وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ، وَلَا يَئُودُهُ حِفْظُهُمَا وَهُوَ الْعَلِيُّ الْعَظِيمُ", count: 1, condition: "بعد كل صلاة", virtue: "لم يمنعه من دخول الجنة إلا أن يموت", source: "رواه النسائي" },
      { id: "after_13", text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 10, condition: "بعد الفجر والمغرب فقط", virtue: "كان النبي ﷺ يقولها دبر صلاة الصبح والمغرب", source: "رواه الترمذي" },
      { id: "after_14", text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا", count: 1, condition: "بعد الفجر فقط", virtue: "دعاء بعد الفجر", source: "رواه ابن ماجه" },
      { id: "after_15", text: "اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ", count: 7, condition: "بعد الفجر والمغرب فقط", virtue: "دعاء بعد الفجر والمغرب", source: "رواه أبو داود" }
    ]
  },
  {
    category: "🕌 صلاة الجمعة",
    items: [
      { id: "jumuah_1", text: "الإكثار من الصلاة على النبي ﷺ يوم الجمعة وليلتها", count: 1, condition: "يوم الجمعة", virtue: "عرضها على النبي ﷺ", source: "رواه أبو داود" },
      { id: "jumuah_2", text: "قراءة سورة الكهف", count: 1, condition: "يوم الجمعة", virtue: "أضاء له من النور ما بين الجمعتين", source: "رواه الحاكم" }
    ]
  }
];

const PROGRESS_KEY = 'wirdi_salah_athkar_progress';

function toAr(s) { 
  return String(s).replace(/[0-9]/g, d => ['٠','','٢','٣','٤','','٦','٧','٨',''][d]); 
}

function getProgress() { 
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; } 
  catch { return {}; } 
}

function saveProgress(id, currentCount) {
  const progress = getProgress();
  progress[id] = currentCount <= 0 ? 'done' : currentCount;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  updateGlobalProgress();
}

function updateGlobalProgress() {
  const progress = getProgress();
  let total = 0, completed = 0;
  SALAH_ATHKAR_DATA.forEach(cat => cat.items.forEach(item => {
    total++; 
    if (progress[item.id] === 'done') completed++;
  }));
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  const fill = document.getElementById('progressFill');
  const text = document.getElementById('progressText');
  if (fill) fill.style.width = pct + '%';
  if (text) text.textContent = toAr(pct) + '٪ مكتمل';
}

function renderAthkar() {
  const container = document.getElementById('athkarSalahContainer');
  if (!container) return;
  container.innerHTML = '';
  const progress = getProgress();

  SALAH_ATHKAR_DATA.forEach(cat => {
    const catTitle = document.createElement('h3');
    catTitle.className = 'category-title';
    catTitle.textContent = cat.category;
    container.appendChild(catTitle);

    cat.items.forEach(item => {
      const currentCount = progress[item.id] === 'done' ? 0 : (progress[item.id] || item.count);
      const isCompleted = currentCount === 0;
      const card = document.createElement('div');
      card.className = `dhikr-card ${isCompleted ? 'completed' : ''} ${item.count >= 33 ? 'high-count' : ''}`;
      card.id = `card-${item.id}`;
      
      const conditionBadge = item.condition ? `<span class="meta-badge condition">🕰️ ${item.condition}</span>` : '';
      
      // تحديد نوع العرض بناءً على عدد التكرار
      const needsCounter = item.count > 1;
      const counterHTML = needsCounter ? `
        <div class="counter-display">
          <div class="counter-circle" data-progress="${((item.count - currentCount) / item.count) * 100}">
            <svg viewBox="0 0 36 36" class="progress-ring">
              <path class="progress-ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path class="progress-ring-fill" stroke-dasharray="${((item.count - currentCount) / item.count) * 100}, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div class="counter-number">
              <span class="current">${toAr(item.count - currentCount)}</span>
              <span class="separator">/</span>
              <span class="total">${toAr(item.count)}</span>
            </div>
          </div>
          <div class="counter-controls">
            <button class="counter-btn minus" onclick="decrementCount('${item.id}', ${item.count})" ${isCompleted ? 'disabled' : ''}>−</button>
            <button class="counter-btn plus" onclick="incrementCount('${item.id}', ${item.count})" ${currentCount >= item.count ? 'disabled' : ''}>+</button>
          </div>
        </div>
      ` : `
        <div class="single-action">
          <button class="count-btn" id="btn-${item.id}" ${isCompleted ? 'disabled' : ''} onclick="decrementCount('${item.id}', ${item.count})">
            ${isCompleted ? '✓ تم' : '📿 ذكر'}
          </button>
        </div>
      `;

      card.innerHTML = `
        <p class="dhikr-text">${item.text}</p>
        <div class="dhikr-meta">
          ${conditionBadge}
          ${item.virtue ? `<span class="meta-badge">💡 ${item.virtue}</span>` : ''}
          <span class="meta-badge source">📚 ${item.source}</span>
        </div>
        ${counterHTML}
      `;
      container.appendChild(card);
    });
  });
  updateGlobalProgress();
}

function decrementCount(id, maxCount) {
  const progress = getProgress();
  let current = progress[id] === 'done' ? 0 : (progress[id] || maxCount);
  
  if (current > 0) {
    current--;
    saveProgress(id, current);
    
    const countEl = document.querySelector(`#card-${id} .current`);
    const btnEl = document.getElementById(`btn-${id}`);
    const cardEl = document.getElementById(`card-${id}`);
    const circleEl = document.querySelector(`#card-${id} .progress-ring-fill`);
    const minusBtn = document.querySelector(`#card-${id} .counter-btn.minus`);
    const plusBtn = document.querySelector(`#card-${id} .counter-btn.plus`);
    
    if (countEl) countEl.textContent = toAr(maxCount - current);
    if (circleEl) circleEl.setAttribute('stroke-dasharray', `${((maxCount - current) / maxCount) * 100}, 100`);
    
    if (current === 0) {
      if (btnEl) { btnEl.disabled = true; btnEl.innerHTML = '✓ تم'; }
      if (cardEl) cardEl.classList.add('completed');
      if (minusBtn) minusBtn.disabled = true;
      if (plusBtn) plusBtn.disabled = true;
      if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    } else {
      if (navigator.vibrate) navigator.vibrate(30);
    }
  }
}

function incrementCount(id, maxCount) {
  const progress = getProgress();
  let current = progress[id] === 'done' ? 0 : (progress[id] || maxCount);
  
  if (current < maxCount) {
    current++;
    saveProgress(id, current);
    
    const countEl = document.querySelector(`#card-${id} .current`);
    const cardEl = document.getElementById(`card-${id}`);
    const circleEl = document.querySelector(`#card-${id} .progress-ring-fill`);
    const minusBtn = document.querySelector(`#card-${id} .counter-btn.minus`);
    const plusBtn = document.querySelector(`#card-${id} .counter-btn.plus`);
    
    if (countEl) countEl.textContent = toAr(maxCount - current);
    if (circleEl) circleEl.setAttribute('stroke-dasharray', `${((maxCount - current) / maxCount) * 100}, 100`);
    
    if (current === 0) {
      if (cardEl) cardEl.classList.remove('completed');
      if (minusBtn) minusBtn.disabled = false;
    }
    if (current >= maxCount) {
      if (plusBtn) plusBtn.disabled = true;
    } else {
      if (plusBtn) plusBtn.disabled = false;
    }
    
    if (navigator.vibrate) navigator.vibrate(20);
  }
}

function resetProgress() {
  if (confirm('هل أنت متأكد من إعادة تعيين تقدم جميع الأذكار؟')) {
    localStorage.removeItem(PROGRESS_KEY);
    renderAthkar();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderAthkar();
  const resetBtn = document.getElementById('resetProgressBtn');
  if (resetBtn) resetBtn.addEventListener('click', resetProgress);
});
