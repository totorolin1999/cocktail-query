import argparse
import json
import re
import unicodedata
from pathlib import Path

FIXTURE_DIR = Path(__file__).resolve().parents[1] / 'fixtures'


CHINESE_NAMES = {
    'alexander': '亞歷山大', 'americano': '美國佬', 'angel-face': '天使之顏',
    'aviation': '航空', 'bees-knees': '蜜蜂之膝', 'bellini': '貝里尼',
    'between-the-sheets': '床笫之間', 'black-russian': '黑色俄羅斯',
    'bloody-mary': '血腥瑪麗', 'boulevardier': '林蔭大道', 'bramble': '黑莓琴酒',
    'brandy-crusta': '白蘭地克魯斯塔', 'caipirinha': '凱匹林納',
    'canchanchara': '坎昌查拉', 'cardinale': '樞機主教', 'casino': '卡西諾',
    'champagne-cocktail': '香檳雞尾酒', 'chartreuse-swizzle': '夏翠絲搖拌',
    'clover-club': '三葉草俱樂部', 'corpse-reviver-2': '屍體復甦者 2 號',
    'cosmopolitan': '柯夢波丹', 'cuba-libre': '自由古巴', 'daiquiri': '黛綺莉',
    'dark-n-stormy': '黑暗風暴', 'dons-special-daiquiri': '唐氏特調黛綺莉',
    'dry-martini': '乾馬丁尼', 'espresso-martini': '濃縮咖啡馬丁尼',
    'fernandito': '費南迪托', 'french-75': '法式 75', 'french-connection': '法式連結',
    'french-martini': '法式馬丁尼', 'garibaldi': '加里波第',
    'gin-basil-smash': '羅勒琴酒碎', 'gin-fizz': '琴費士',
    'grand-margarita': '大瑪格麗特', 'grasshopper': '蚱蜢', 'hanky-panky': '漢基潘基',
    'hemingway-special': '海明威特調', 'horses-neck': '馬頸', 'iba-tiki': 'IBA 提基',
    'illegal': '非法', 'irish-coffee': '愛爾蘭咖啡', 'john-collins': '約翰可林',
    'jungle-bird': '叢林之鳥', 'kir': '基爾', 'last-word': '最後一語',
    'lemon-drop-martini': '檸檬滴馬丁尼', 'long-island-iced-tea': '長島冰茶',
    'mai-tai': '邁泰', 'manhattan': '曼哈頓', 'margarita': '瑪格麗特',
    'martinez': '馬丁尼茲', 'mary-pickford': '瑪麗·畢克馥', 'mimosa': '含羞草',
    'mint-julep': '薄荷茱莉普', 'missionarys-downfall': '傳教士的墜落',
    'mojito': '莫希托', 'monkey-gland': '猴腺', 'moscow-mule': '莫斯科騾子',
    'naked-and-famous': '赤裸而聞名', 'negroni': '內格羅尼',
    'new-york-sour': '紐約酸酒', 'old-cuban': '老古巴',
    'old-fashioned': '古典雞尾酒', 'paloma': '帕洛瑪', 'paper-plane': '紙飛機',
    'paradise': '天堂', 'penicillin': '盤尼西林', 'pina-colada': '鳳梨可樂達',
    'pisco-punch': '皮斯可潘趣', 'pisco-sour': '皮斯可酸酒',
    'planters-punch': '種植園潘趣', 'porn-star-martini': '性感明星馬丁尼',
    'porto-flip': '波特翻轉', 'rabo-de-galo': '公雞尾', 'ramos-fizz': '拉莫斯琴費士',
    'remember-the-maine': '緬因州的回憶', 'russian-spring-punch': '俄羅斯春日潘趣',
    'rusty-nail': '鏽釘', 'sazerac': '薩澤拉克', 'sea-breeze': '海風',
    'sex-on-the-beach': '性感海灘', 'sherry-cobbler': '雪莉鞋匠', 'sidecar': '側車',
    'singapore-sling': '新加坡司令', 'south-side': '南方', 'spicy-fifty': '辛辣五十',
    'spritz': '斯普利茲', 'stinger': '刺針', 'suffering-bastard': '受苦混蛋',
    'tequila-sunrise': '龍舌蘭日出', 'three-dots-and-a-dash': '三點一劃',
    'tipperary': '蒂珀雷里', 'tommys-margarita': '湯米瑪格麗特',
    'trinidad-sour': '千里達酸酒', 'tuxedo': '燕尾服', 've-n-to': '威尼托',
    'vesper': '維斯珀', 'vieux-carre': '維尤卡雷',
    'whiskey-sour': '威士忌酸酒', 'white-lady': '白色佳人', 'zombie': '殭屍',
}

ENGLISH_NAMES = {
    'bees-knees': "Bee's Knees", 'between-the-sheets': 'Between the Sheets',
    'corpse-reviver-2': 'Corpse Reviver #2', 'dark-n-stormy': "Dark 'n' Stormy",
    'dons-special-daiquiri': "Don's Special Daiquiri", 'horses-neck': "Horse's Neck",
    'missionarys-downfall': "Missionary's Downfall", 'pina-colada': 'Piña Colada',
    'planters-punch': "Planter's Punch", 'porn-star-martini': 'Porn Star Martini',
    'russian-spring-punch': 'Russian Spring Punch', 'tommys-margarita': "Tommy's Margarita",
    've-n-to': 'Ve.N.To',
}

GLASSES = {
    'old fashioned glass': ('Old Fashioned glass', '古典杯'),
    'highball glass': ('Highball glass', '高球杯'),
    'collins glass': ('Collins glass', '可林杯'),
    'cocktail glass': ('Cocktail glass', '雞尾酒杯'),
    'coupe glass': ('Coupe glass', '庫普杯'),
    'champagne flute': ('Champagne flute', '香檳笛型杯'),
    'wine glass': ('Wine glass', '葡萄酒杯'),
    'hurricane glass': ('Hurricane glass', '颶風杯'),
    'rocks glass': ('Rocks glass', '岩石杯'),
    'tumbler': ('Tumbler', '平底杯'),
    'goblet': ('Goblet', '高腳杯'),
    'julep cup': ('Julep cup', '茱莉普杯'),
    'tiki mug': ('Tiki mug', '提基杯'),
    'irish coffee glass': ('Irish coffee glass', '愛爾蘭咖啡杯'),
    'cobbler glass': ('Cobbler glass', '科布勒杯'),
    'margarita glass': ('Margarita glass', '瑪格麗特杯'),
    'white wine glass': ('White wine glass', '白葡萄酒杯'),
}

GLASS_OVERRIDES = {
    'bellini': 'champagne flute', 'canchanchara': 'old fashioned glass',
    'champagne-cocktail': 'champagne flute', 'chartreuse-swizzle': 'highball glass',
    'dons-special-daiquiri': 'cocktail glass', 'grand-margarita': 'margarita glass',
    'iba-tiki': 'tiki mug', 'irish-coffee': 'irish coffee glass',
    'john-collins': 'collins glass', 'kir': 'white wine glass',
    'mimosa': 'champagne flute', 'mint-julep': 'julep cup',
    'missionarys-downfall': 'tiki mug', 'mojito': 'highball glass',
    'bloody-mary': 'rocks glass',
    'whiskey-sour': 'cobbler glass',
    'pina-colada': 'hurricane glass', 'sazerac': 'old fashioned glass',
    'sherry-cobbler': 'wine glass', 'three-dots-and-a-dash': 'tiki mug',
}

TRANSLATIONS = {
    'absinthe': '苦艾酒', 'agave nectar': '龍舌蘭糖漿', 'amaretto': '杏仁香甜酒',
    'amaro nonino': 'Nonino 苦味利口酒', 'aperol': '阿佩羅', 'bitters': '苦精',
    'angostura': '安格式苦精', 'apricot brandy': '杏桃白蘭地',
    'cherry brandy': '櫻桃香甜酒', 'peach brandy': '蜜桃白蘭地',
    'brandy': '白蘭地', 'bourbon': '波本威士忌',
    'basil': '羅勒', 'benedictine': '班尼狄克丁香甜酒',
    'calvados': '蘋果白蘭地', 'campari': '金巴利', 'cachaca': '卡莎薩酒',
    'champagne': '香檳', 'chartreuse': '夏翠絲香甜酒', 'cherry': '櫻桃',
    'cinnamon': '肉桂', 'cognac': '干邑白蘭地', 'coffee': '咖啡',
    'chamomile cordial': '洋甘菊糖漿', 'cloves': '丁香',
    'cointreau': '君度橙酒', 'cola': '可樂', 'cream': '鮮奶油',
    'creme de cacao': '可可香甜酒', 'creme de cassis': '黑醋栗香甜酒',
    'creme de menthe': '薄荷香甜酒', 'crème de mûre': '黑莓香甜酒',
    'crème de violette': '紫羅蘭香甜酒', 'cranberry juice': '蔓越莓汁',
    'cuban aguardiente': '古巴甘蔗烈酒', 'curacao': '庫拉索酒', 'cynar': '奇拿苦酒',
    'london dry gin': '倫敦乾琴酒', 'old tom gin': '老湯姆琴酒',
    'dry gin': '乾琴酒', 'dry vermouth': '乾苦艾酒', 'donn s mix': '唐氏混合果汁',
    'drambuie': '德蘭布依香甜酒', 'elderflower': '接骨木花',
    'egg white': '蛋白', 'egg yolk': '蛋黃', 'espresso': '濃縮咖啡',
    'falernum': '法勒南香甜酒', 'fernet': '費爾內特苦酒', 'frangelico': '榛果香甜酒',
    'donns mix': '唐氏混合果汁',
    'gin': '琴酒', 'ginger beer': '薑汁啤酒', 'ginger ale': '薑汁汽水',
    'gengibre slice': '薑片', 'grapefruit juice': '葡萄柚汁',
    'grand marnier': '柑曼怡橙酒', 'grenadine': '石榴糖漿',
    'honey syrup': '蜂蜜糖漿', 'honey': '蜂蜜',
    'irish whiskey': '愛爾蘭威士忌', 'kahlua': '咖啡香甜酒',
    'lagavulin': '拉加維林威士忌', 'lemon juice': '檸檬汁',
    'lemon': '檸檬', 'lillet blanc': '莉蕾白苦艾酒', 'lime juice': '萊姆汁',
    'lime': '萊姆', 'maraschino': '馬拉斯奇諾櫻桃酒', 'mezcal': '梅斯卡爾酒',
    'martinique molasses rhum': '馬丁尼克糖蜜蘭姆酒', 'mint': '薄荷',
    'nutmeg': '肉豆蔻', 'orange bitters': '橙味苦精',
    'orange juice': '柳橙汁', 'orange': '柳橙', 'orgeat': '杏仁糖漿',
    'passion fruit': '百香果', 'peach schnapps': '蜜桃香甜酒',
    'pernod': '培諾苦艾酒', 'peychaud': '皮肖苦精', 'palo cortado': '帕洛科塔多雪莉酒',
    'pisco': '皮斯可',
    'pineapple juice': '鳳梨汁', 'pineapple': '鳳梨', 'prosecco': '普羅賽克氣泡酒',
    'aged rum': '熟成蘭姆酒', 'amber jamaican rum': '牙買加琥珀蘭姆酒',
    'blackstrap rum': '黑糖蜜蘭姆酒', 'blended aged rum': '調和熟成蘭姆酒',
    'cuban rum': '古巴蘭姆酒', 'demerara rum': '德梅拉拉蘭姆酒',
    'gold jamaican rum': '牙買加金蘭姆酒',
    'gold puerto rican rum': '波多黎各金蘭姆酒',
    'goslings rum': '哥斯林蘭姆酒',
    'jamaica overproof white rum': '牙買加高酒精度白蘭姆酒',
    'jamaican dark rum': '牙買加深色蘭姆酒',
    'jamaican rum': '牙買加蘭姆酒', 'white rum': '白蘭姆酒',
    'raspberry': '覆盆子', 'rum': '蘭姆酒', 'rye whiskey': '黑麥威士忌',
    'rhum martinique agricole': '馬丁尼克農業蘭姆酒',
    'ron profundo havana club': 'Havana Club Profundo 蘭姆酒',
    'ron smoky havana club': 'Havana Club Smoky 蘭姆酒',
    'white cuban ron': '古巴白蘭姆酒',
    'scotch whisky': '蘇格蘭威士忌', 'sherry': '雪莉酒',
    'simple syrup': '簡單糖漿',     'soda water': '蘇打水', 'salt': '鹽', 'sugar': '糖',
    '100 agave tequila': '100% 龍舌蘭酒',
    'tequila 100 agave': '100% 龍舌蘭酒',
    'tequila': '龍舌蘭酒', 'tomato juice': '番茄汁', 'triple sec': '橙皮香甜酒',
    'vermouth': '苦艾酒', 'smirnoff vodka': '斯米諾伏特加',
    'vanilla vodka': '香草伏特加', 'vodka vanilla': '香草伏特加',
    'vodka citron': '檸檬伏特加',
    'vodka': '伏特加', 'water': '水',
    'vanilla extract': '香草精', 'white peach puree': '白桃泥',
    'white smooth grappa': '白葡萄渣白蘭地', 'pink grapefruit soda': '粉紅葡萄柚汽水',
    'tabasco celery salt pepper': '塔巴斯可辣醬、芹菜鹽與胡椒',
    'red chili pepper': '紅辣椒', 'fresh ginger': '新鮮薑',
    'whiskey': '威士忌', 'whisky': '威士忌', 'wine': '葡萄酒',
    'worcestershire sauce': '伍斯特醬',
}


def normalize(value):
    value = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
    return re.sub(r'[^a-z0-9]+', ' ', value.lower()).strip()


def parse_ingredient(raw):
    text = re.sub(r'\s+', ' ', raw.replace('\u00a0', ' ')).strip()
    patterns = [
        r'^(\d+(?:\.\d+)?(?:\s+\d+/\d+|/\d+)?(?:\s*(?:[-–]|to)\s*\d+(?:\.\d+)?)?\s*(?:ml|cl|oz|dashes?|drops?|bar\s*spoons?|tablespoons?|teaspoons?|tsp|pcs?|pieces?|cubes?|leaves?|sprigs?|slices?|quarters?|whole|pinches?)?)\s+(.+)$',
        r'^(few dashes|few drops|a dash|a pinch|a splash|splash|dash|top up with|top up|top with|fill up with|fill up|to taste)(?:\s+of)?\s+(.+)$',
        r'^(\d+(?:\s*[-/]\s*\d+)?|one|two|three|four|five)\s+(.+)$',
    ]
    amount, name = '', text
    for pattern in patterns:
        match = re.match(pattern, text, re.IGNORECASE)
        if match:
            amount = re.sub(r'\s+', ' ', match.group(1)).strip()
            name = match.group(2).strip()
            break
    amount = re.sub(r'\s+of$', '', amount, flags=re.IGNORECASE)
    name = re.sub(r'^(?:of|with)\s+', '', name, flags=re.IGNORECASE)
    if 'sliced fresh ginger' in name.lower():
        name = 'Fresh ginger'
    if 'thin slices red chili pepper' in name.lower():
        name = 'Red chili pepper'
        amount = amount or '2 slices'
    if 'up to taste' in name.lower() and 'tabasco' in name.lower():
        name = 'Tabasco, Celery Salt, Pepper'
        amount = amount or 'Up to taste'
    if not amount and normalize(name) in ('soda water', 'ginger beer'):
        amount = 'Top up'
    if amount and re.fullmatch(r'\d+(?:\.\d+)?', amount) and any(
        word in name.lower() for word in ('juice', 'water', 'soda', 'wine', 'coffee', 'cream')
    ):
        amount += ' ml'

    normalized_name = normalize(name)
    name_zh = ''
    for term, translation in sorted(TRANSLATIONS.items(), key=lambda item: len(item[0]), reverse=True):
        if re.search(r'(?<![a-z0-9])' + re.escape(normalize(term)) + r'(?![a-z0-9])', normalized_name):
            name_zh = translation
            break

    if re.search(r'\b(apricot|peach|cherry) brandy\b', normalized_name):
        category = 'liqueur'
    elif re.search(r'\b(vodka|gin|rum|whisk(?:e)?y|bourbon|brandy|cognac|tequila|cachaca|pisco|mezcal|calvados|grappa|rhum|ron)\b', normalized_name):
        category = 'base'
    elif re.search(r'\b(liqueur|amaro|amaretto|aperol|campari|cointreau|triple sec|curacao|chartreuse|maraschino|drambuie|falernum|cynar|fernet|benedictine|kahlua|creme|cassis|schnapps|cordial|pernod)\b', normalized_name):
        category = 'liqueur'
    elif re.search(r'\b(absinthe|vermouth|sherry|wine|champagne|prosecco|bitters?)\b', normalized_name):
        category = 'alcohol'
    else:
        category = 'ingredient'

    return {
        'name_zh': name_zh or name,
        'name_en': name,
        'amount': amount,
        'unit_zh': '',
        'unit_en': '',
        'category': category,
    }


def translate_garnish(text):
    terms = [
        ('cocktail cherry', '雞尾酒櫻桃'), ('cherry', '櫻桃'),
        ('salt rim', '鹽口杯緣'),
        ('orange zest', '柳橙皮'), ('orange slice', '柳橙片'),
        ('orange twist', '柳橙皮捲'), ('lemon zest', '檸檬皮'),
        ('lemon slice', '檸檬片'), ('lemon twist', '檸檬皮捲'),
        ('lime wedge', '萊姆角'), ('lime slice', '萊姆片'),
        ('pineapple', '鳳梨'), ('mint', '薄荷葉'), ('nutmeg', '肉豆蔻粉'),
        ('blackberries', '黑莓'), ('raspberries', '覆盆子'),
        ('berries', '莓果'), ('coffee beans', '咖啡豆'),
        ('passion fruit', '百香果'), ('celery', '西洋芹'),
        ('chili pepper', '辣椒'), ('grapes', '葡萄'),
        ('ginger', '薑片'), ('lemon', '檸檬'), ('orange', '柳橙'),
        ('lime', '萊姆'),
    ]
    found = []
    for term, translation in terms:
        if term in text.lower() and translation not in found:
            if term == 'cherry' and any('櫻桃' in item for item in found):
                continue
            if term == 'lemon' and any('檸檬' in item for item in found):
                continue
            if term == 'orange' and any('柳橙' in item for item in found):
                continue
            if term == 'lime' and any('萊姆' in item for item in found):
                continue
            found.append(translation)
    return '、'.join(found) if found else ('無' if normalize(text) in ('n a', 'na') else '依酒譜裝飾')


DIRECT_BUILD_METHODS = {
    'americano': ('在裝有冰塊的杯中加入金巴利與甜苦艾酒，補入蘇打水並輕拌。', 'Build Campari and sweet vermouth over ice, top with soda water, and stir gently.'),
    'bellini': ('將白桃泥放入裝有冰塊的調酒杯，加入普羅賽克並輕輕攪拌，接著倒入冰鎮香檳杯。', 'Add the peach purée and Prosecco to a mixing glass with ice. Stir gently and pour into a chilled flute.'),
    'bees-knees': ('將蜂蜜糖漿與檸檬汁、柳橙汁攪拌至溶解，加入琴酒與冰塊搖勻，濾入冰鎮雞尾酒杯。', 'Stir honey syrup with lemon and orange juices until it dissolves, add gin and shake with ice. Strain into a chilled cocktail glass.'),
    'black-russian': ('將材料倒入裝有冰塊的古典杯中，輕輕攪拌，再濾入另一個裝有冰塊的古典杯。', 'Pour the ingredients into an ice-filled Old Fashioned glass and stir gently, then strain into another Old Fashioned glass filled with ice.'),
    'bloody-mary': ('將所有材料放入裝有冰塊的調酒杯中輕輕攪拌，倒入岩石杯。若要加冰供應，則倒入高球杯。', 'Stir all ingredients gently in a mixing glass with ice, then pour into a rocks glass. If serving over ice, pour into a highball glass.'),
    'canchanchara': ('先將蜂蜜、水與萊姆汁混合，倒入古典杯並抹勻杯底與杯壁；加入碎冰和古巴甘蔗烈酒，由下往上用力攪拌。', 'Mix the honey, water, and lime juice, then coat the bottom and sides of an Old Fashioned glass. Add cracked ice and Cuban aguardiente; stir vigorously from the bottom up.'),
    'caipirinha': ('在古典杯中輕壓萊姆角與糖，加入卡莎薩酒和碎冰，攪拌均勻。', 'Muddle the lime wedges with sugar in an Old Fashioned glass, add cachaça and crushed ice, then stir.'),
    'fernandito': ('在裝有冰塊的古典杯中倒入費爾內特苦酒，以可樂補滿並輕拌。', 'Build Fernet over ice in an Old Fashioned glass, top with cola, and stir gently.'),
    'french-connection': ('將干邑白蘭地與杏仁香甜酒倒入裝有冰塊的古典杯中，輕輕攪拌。', 'Build the Cognac and amaretto over ice in an Old Fashioned glass and stir gently.'),
    'horses-neck': ('在高球杯中加入冰塊與干邑白蘭地，倒入薑汁汽水，最後加入苦精。', 'Build the Cognac over ice in a highball glass, top with ginger ale, and add bitters.'),
    'irish-coffee': ('將糖加入熱咖啡中攪拌溶解，再加入愛爾蘭威士忌；輕輕浮上一層冷鮮奶油。', 'Dissolve the sugar in hot coffee, add Irish whiskey, then carefully float the chilled cream on top.'),
    'long-island-iced-tea': ('將可樂以外的材料與冰塊搖勻，倒入裝有冰塊的高球杯，再以可樂補滿。', 'Shake all ingredients except cola with ice, pour into an ice-filled highball glass, then top with cola.'),
    'mimosa': ('將柳橙汁倒入香檳杯，再緩緩加入普羅賽克氣泡酒並輕輕混合。', 'Pour the orange juice into a flute, top slowly with Prosecco, and stir gently.'),
    'mint-julep': ('在茱莉普杯中輕壓薄荷、糖與水，加入波本威士忌和碎冰，攪拌冰鎮。', 'Gently muddle the mint, sugar, and water in a Julep cup; add bourbon and crushed ice, then stir until chilled.'),
    'mojito': ('將薄荷、糖與萊姆汁混合，加入少量蘇打水並以冰塊裝滿高球杯；倒入白古巴蘭姆酒，再以蘇打水補滿，輕輕攪拌。', 'Mix the mint with sugar and lime juice. Add a splash of soda water and fill the highball glass with ice. Pour in the white Cuban rum, top with soda water, and stir lightly.'),
    'moscow-mule': ('在裝有冰塊的杯中加入伏特加與萊姆汁，以薑汁啤酒補滿並輕拌。', 'Build the vodka and lime juice over ice, top with ginger beer, and stir gently.'),
    'negroni': ('將琴酒、金巴利與甜苦艾酒倒入裝有冰塊的古典杯中，輕輕攪拌。', 'Build the gin, Campari, and sweet vermouth over ice in an Old Fashioned glass and stir gently.'),
    'paloma': ('在高球杯中加入龍舌蘭酒、萊姆與鹽，放入冰塊後以葡萄柚汽水補滿並輕拌。', 'Build the tequila, lime, and salt in a highball glass over ice, top with grapefruit soda, and stir gently.'),
    'rabo-de-galo': ('將材料倒入裝有冰塊的杯中，輕輕攪拌混合。', 'Build the ingredients over ice and stir gently.'),
    'rusty-nail': ('將蘇格蘭威士忌與德蘭布依香甜酒倒入裝有冰塊的古典杯中，輕輕攪拌。', 'Build the Scotch whisky and Drambuie over ice in an Old Fashioned glass and stir gently.'),
    'spritz': ('在葡萄酒杯中加入冰塊、普羅賽克與阿佩羅，以蘇打水補滿並輕拌。', 'Build the Prosecco and Aperol over ice in a wine glass, top with soda water, and stir gently.'),
    'tequila-sunrise': ('在高球杯中將龍舌蘭酒與柳橙汁倒在冰塊上，沿杯緣緩緩倒入石榴糖漿形成漸層，不攪拌。', 'Build the tequila and orange juice over ice in a highball glass. Slowly pour grenadine around the inside edge to create a sunrise effect; do not stir.'),
}


def method(codes, ingredients, slug):
    codes = set(codes)
    if slug in DIRECT_BUILD_METHODS:
        return DIRECT_BUILD_METHODS[slug]
    if slug == 'sazerac':
        return (
            '以苦艾酒潤洗冰鎮古典杯，加入碎冰暫置。將其餘材料在調酒杯中加冰攪拌，倒掉杯中冰塊與多餘苦艾酒，再將酒液濾入杯中。',
            'Rinse a chilled Old Fashioned glass with absinthe and set it aside with crushed ice. Stir the remaining ingredients with ice in a mixing glass, discard the prepared glass ice and excess absinthe, then strain the drink into it.',
        )
    if slug == 'ramos-fizz':
        return (
            '除蘇打水外的材料加冰搖盪約兩分鐘並雙重過濾；將酒液倒回雪克壺，不加冰再用力搖約一分鐘。濾入高球杯後補上蘇打水。',
            'Shake all ingredients except soda water with ice for about two minutes and double-strain. Return the drink to the shaker and shake hard without ice for about one minute; strain into a highball glass and top with soda water.',
        )
    if slug == 'chartreuse-swizzle':
        return (
            '將材料倒入裝有碎冰的高球杯，以調酒棒由下往上攪拌至杯身冰冷。',
            'Build the ingredients in a highball glass filled with crushed ice and swizzle from the bottom up until the glass is chilled.',
        )
    if slug == 'champagne-cocktail':
        return (
            '將方糖放入香檳杯，滴上苦精與柑曼怡，再加入干邑白蘭地。緩緩倒入冰鎮香檳。', 
            'Place the sugar cube in a flute, add the bitters and Grand Marnier, then the Cognac. Top slowly with chilled Champagne.',
        )
    if slug == 'whiskey-sour':
        return (
            '將所有材料放入裝有冰塊的雪克壺中充分搖勻，濾入科布勒杯；若要加冰供應，則濾入裝有冰塊的古典杯。使用蛋白時需更用力搖盪以打發並混合泡沫。',
            'Shake all ingredients well in a cocktail shaker filled with ice and strain into a cobbler glass. For an on-the-rocks serve, strain into an Old Fashioned glass filled with ice. If using egg white, shake harder to release and incorporate the foam.',
        )
    carbonated = any(
        term in normalize(item['name_en'])
        for item in ingredients
        for term in ('soda water', 'champagne', 'prosecco', 'cola', 'ginger beer', 'ginger ale', 'grapefruit soda')
    )
    if slug in ('bees-knees', 'daiquiri'):
        codes.add('shake')
    if slug in ('french-75', 'john-collins'):
        codes.add('shake')
    if 'muddle' in codes and 'stir' in codes:
        if slug == 'old-fashioned':
            return (
                '在古典杯中輕壓方糖、苦精與少量水，加入波本或黑麥威士忌及冰塊，攪拌冰鎮。不要濾出。',
                'Muddle the sugar cube, bitters, and a little water in an Old Fashioned glass. Add bourbon or rye and ice; stir until chilled without straining.',
            )
        return (
            '先將糖或香草輕壓出香氣，加入冰塊與其餘材料，再輕輕攪拌冰鎮。',
            'Gently muddle the sugar or herbs, add ice and the remaining ingredients, then stir until chilled.',
        )
    if 'muddle' in codes and 'shake' in codes:
        return (
            '先輕壓香草或水果釋放香氣，再加入其餘材料與冰塊搖勻，濾入杯中。',
            'Gently muddle the herbs or fruit, add the remaining ingredients and ice, shake, then strain into the glass.',
        )
    if 'blend' in codes:
        return ('將材料與冰塊攪打至均勻，倒入杯中。', 'Blend the ingredients with ice until smooth, then pour into the glass.')
    if 'layer' in codes:
        return ('依酒譜順序緩慢倒入材料，保持分層。', 'Pour the ingredients slowly into the glass in recipe order to create distinct layers.')
    if 'shake' in codes:
        if carbonated:
            if any('egg white' in normalize(item['name_en']) for item in ingredients):
                return ('先將不含氣泡材料的配方乾搖，再加冰搖至冰鎮，濾入杯中後以氣泡材料補滿。', 'Dry-shake the non-carbonated ingredients first, add ice and shake until chilled, strain into the glass, then top with the carbonated ingredient.')
            return ('將氣泡材料以外的材料與冰塊搖至冰鎮，濾入杯中後再加入氣泡材料。', 'Shake all ingredients except the carbonated ingredient with ice until chilled, strain into the glass, then add the carbonated ingredient.')
        if any('egg white' in normalize(item['name_en']) for item in ingredients):
            return ('將材料與冰塊放入雪克壺充分搖勻；若加入蛋白，需更用力搖盪以打發並混合泡沫。', 'Shake all ingredients well with ice. If using egg white, shake harder to release and incorporate the foam.')
        return ('將材料與冰塊放入雪克壺，搖至冰鎮後濾入杯中。', 'Shake the ingredients with ice until chilled, then strain into the glass.')
    if 'stir' in codes:
        return ('將材料與冰塊放入調酒杯攪拌冰鎮，再濾入杯中。', 'Stir the ingredients with ice until chilled, then strain into the glass.')
    return ('將材料依序倒入杯中；含氣泡的材料最後加入，輕輕混合。', 'Add ingredients in order, topping with carbonated ingredients last; stir gently.')


def profile(ingredients):
    names = ' '.join(normalize(item['name_en']) for item in ingredients)
    if any(term in names for term in ('cream', 'milk', 'coffee', 'cacao', 'chocolate')):
        return ('口感圓潤，帶有奶香、咖啡或可可調性。', 'A rounded texture with creamy, coffee, or cocoa notes.')
    if any(term in names for term in ('campari', 'aperol', 'vermouth', 'bitters', 'cynar', 'amaro')):
        return ('帶有草本與苦甜層次，尾韻乾爽。', 'Herbal bittersweet layers lead to a dry finish.')
    if any(term in names for term in ('mint', 'basil', 'ginger')):
        return ('草本或辛香氣息鮮明，口感清新。', 'Fresh herbal or spicy notes give it a lively profile.')
    if any(term in names for term in ('lemon', 'lime', 'grapefruit', 'cranberry', 'pineapple', 'orange', 'passion fruit')):
        return ('果香與柑橘酸度突出，呈現清爽的酸甜平衡。', 'Fruit and citrus acidity create a bright sweet-tart balance.')
    return ('以基酒香氣為主，呈現經典而平衡的酒感。', 'The base spirit leads a classic, balanced profile.')


def strength(ingredients):
    base_count = sum(item['category'] == 'base' for item in ingredients)
    names = ' '.join(normalize(item['name_en']) for item in ingredients)
    if base_count >= 2 and not any(term in names for term in ('juice', 'soda', 'cola', 'ginger beer')):
        return 'high'
    if any(term in names for term in ('juice', 'soda', 'cola', 'ginger beer', 'champagne', 'prosecco')):
        return 'low' if base_count <= 1 else 'medium'
    return 'medium' if base_count <= 1 else 'high'


def artwork_color(ingredients):
    names = ' '.join(normalize(item['name_en']) for item in ingredients)
    for terms, color in (
        (('blue curacao',), 'blue'),
        (('coffee', 'cacao', 'chocolate', 'cola'), 'brown'),
        (('cream', 'milk', 'egg yolk'), 'cream'),
        (('campari', 'grenadine', 'cranberry', 'raspberry'), 'red'),
        (('mint', 'basil', 'chartreuse'), 'green'),
        (('orange juice', 'pineapple', 'passion fruit'), 'orange'),
    ):
        if any(term in names for term in terms):
            return color
    return 'amber'


def build_records(rows):
    records = []
    for row in rows:
        slug = row['slug']
        english_name = ENGLISH_NAMES.get(slug, slug.replace('-', ' ').title())
        ingredients = [parse_ingredient(raw) for raw in row['ingredients']]
        glass_key = GLASS_OVERRIDES.get(slug, row.get('glassware_en') or 'cocktail glass')
        glass_key = glass_key.lower().replace('old-fashioned glass', 'old fashioned glass')
        glass_en, glass_zh = GLASSES[glass_key]
        instructions_zh, _ = method(row.get('method_codes', []), ingredients, slug)
        instructions_en = row.get('method_en', '').strip()
        if not instructions_en:
            raise ValueError(f'Missing official method text for {slug}')
        flavor_zh, flavor_en = profile(ingredients)
        records.append({
            'Chinese_Name': CHINESE_NAMES[slug],
            'English_Name': english_name,
            'iba_category': row['category'],
            'recipe_ingredients': ingredients,
            'instructions_zh': instructions_zh,
            'instructions_en': instructions_en,
            'glassware_zh': glass_zh,
            'glassware_en': glass_en,
            'garnish_zh': translate_garnish(row.get('garnish_en', '')),
            'garnish_en': row.get('garnish_en', ''),
            'flavor_zh': flavor_zh,
            'flavor_en': flavor_en,
            'strength': strength(ingredients),
            'history_zh': '',
            'history_en': '',
            'source_url': row['url'],
            'artwork_color': artwork_color(ingredients),
            'is_active': True,
        })
    if len(records) != 102 or len({record['English_Name'] for record in records}) != 102:
        raise ValueError(f'Expected 102 unique IBA drinks, got {len(records)}')
    expected_categories = {'The unforgettables', 'Contemporary Classics', 'New Era'}
    if {record['iba_category'] for record in records} != expected_categories:
        raise ValueError('IBA records do not contain the expected three categories')
    if any(
        not item['amount'] or item['name_zh'] == item['name_en']
        for record in records
        for item in record['recipe_ingredients']
    ):
        raise ValueError('Every ingredient must have a quantity and a Chinese display name')
    return records


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        'source_json',
        type=Path,
        nargs='?',
        default=FIXTURE_DIR / 'iba_recipe_source.json',
    )
    parser.add_argument(
        'output_json',
        type=Path,
        nargs='?',
        default=FIXTURE_DIR / 'iba_cocktail_recipes.json',
    )
    args = parser.parse_args()
    source_rows = json.loads(args.source_json.read_text(encoding='utf-8-sig'))
    records = build_records(source_rows)
    args.output_json.write_text(json.dumps(records, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Generated {len(records)} IBA cocktail records.')
