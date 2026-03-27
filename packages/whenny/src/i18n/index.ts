/**
 * Whenny Internationalization (i18n)
 *
 * Built-in locale support for date formatting.
 * Configure with: configure({ locale: 'es' })
 */

export interface LocaleStrings {
  // Relative time - past
  justNow: string
  secondsAgo: (n: number) => string
  minutesAgo: (n: number) => string
  hoursAgo: (n: number) => string
  yesterday: string
  daysAgo: (n: number) => string
  weeksAgo: (n: number) => string
  monthsAgo: (n: number) => string
  yearsAgo: (n: number) => string

  // Relative time - future
  inSeconds: (n: number) => string
  inMinutes: (n: number) => string
  inHours: (n: number) => string
  tomorrow: string
  inDays: (n: number) => string
  inWeeks: (n: number) => string
  inMonths: (n: number) => string
  inYears: (n: number) => string

  // Duration
  durationHours: (n: number) => string
  durationMinutes: (n: number) => string
  durationSeconds: (n: number) => string
  durationAbout: (time: string) => string

  // Months
  monthsShort: string[]
  monthsFull: string[]

  // Weekdays
  weekdaysShort: string[]
  weekdaysFull: string[]

  // Smart formatting
  yesterdayAt: (time: string) => string
  tomorrowAt: (time: string) => string
  todayAt: (time: string) => string
  at: string
}

// English (default)
export const en: LocaleStrings = {
  justNow: 'just now',
  secondsAgo: (n) => `${n} second${n === 1 ? '' : 's'} ago`,
  minutesAgo: (n) => `${n} minute${n === 1 ? '' : 's'} ago`,
  hoursAgo: (n) => `${n} hour${n === 1 ? '' : 's'} ago`,
  yesterday: 'yesterday',
  daysAgo: (n) => `${n} day${n === 1 ? '' : 's'} ago`,
  weeksAgo: (n) => `${n} week${n === 1 ? '' : 's'} ago`,
  monthsAgo: (n) => `${n} month${n === 1 ? '' : 's'} ago`,
  yearsAgo: (n) => `${n} year${n === 1 ? '' : 's'} ago`,

  inSeconds: (n) => `in ${n} second${n === 1 ? '' : 's'}`,
  inMinutes: (n) => `in ${n} minute${n === 1 ? '' : 's'}`,
  inHours: (n) => `in ${n} hour${n === 1 ? '' : 's'}`,
  tomorrow: 'tomorrow',
  inDays: (n) => `in ${n} day${n === 1 ? '' : 's'}`,
  inWeeks: (n) => `in ${n} week${n === 1 ? '' : 's'}`,
  inMonths: (n) => `in ${n} month${n === 1 ? '' : 's'}`,
  inYears: (n) => `in ${n} year${n === 1 ? '' : 's'}`,

  durationHours: (n) => `${n} hour${n === 1 ? '' : 's'}`,
  durationMinutes: (n) => `${n} minute${n === 1 ? '' : 's'}`,
  durationSeconds: (n) => `${n} second${n === 1 ? '' : 's'}`,
  durationAbout: (time) => `about ${time}`,

  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  monthsFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

  weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  weekdaysFull: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  yesterdayAt: (time) => `Yesterday at ${time}`,
  tomorrowAt: (time) => `Tomorrow at ${time}`,
  todayAt: (time) => `today at ${time}`,
  at: 'at',
}

// Spanish
export const es: LocaleStrings = {
  justNow: 'ahora mismo',
  secondsAgo: (n) => `hace ${n} segundo${n === 1 ? '' : 's'}`,
  minutesAgo: (n) => `hace ${n} minuto${n === 1 ? '' : 's'}`,
  hoursAgo: (n) => `hace ${n} hora${n === 1 ? '' : 's'}`,
  yesterday: 'ayer',
  daysAgo: (n) => `hace ${n} día${n === 1 ? '' : 's'}`,
  weeksAgo: (n) => `hace ${n} semana${n === 1 ? '' : 's'}`,
  monthsAgo: (n) => `hace ${n} mes${n === 1 ? '' : 'es'}`,
  yearsAgo: (n) => `hace ${n} año${n === 1 ? '' : 's'}`,

  inSeconds: (n) => `en ${n} segundo${n === 1 ? '' : 's'}`,
  inMinutes: (n) => `en ${n} minuto${n === 1 ? '' : 's'}`,
  inHours: (n) => `en ${n} hora${n === 1 ? '' : 's'}`,
  tomorrow: 'mañana',
  inDays: (n) => `en ${n} día${n === 1 ? '' : 's'}`,
  inWeeks: (n) => `en ${n} semana${n === 1 ? '' : 's'}`,
  inMonths: (n) => `en ${n} mes${n === 1 ? '' : 'es'}`,
  inYears: (n) => `en ${n} año${n === 1 ? '' : 's'}`,

  durationHours: (n) => `${n} hora${n === 1 ? '' : 's'}`,
  durationMinutes: (n) => `${n} minuto${n === 1 ? '' : 's'}`,
  durationSeconds: (n) => `${n} segundo${n === 1 ? '' : 's'}`,
  durationAbout: (time) => `aproximadamente ${time}`,

  monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],

  weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],

  yesterdayAt: (time) => `Ayer a las ${time}`,
  tomorrowAt: (time) => `Mañana a las ${time}`,
  todayAt: (time) => `hoy a las ${time}`,
  at: 'a las',
}

// French
export const fr: LocaleStrings = {
  justNow: 'à l\'instant',
  secondsAgo: (n) => `il y a ${n} seconde${n === 1 ? '' : 's'}`,
  minutesAgo: (n) => `il y a ${n} minute${n === 1 ? '' : 's'}`,
  hoursAgo: (n) => `il y a ${n} heure${n === 1 ? '' : 's'}`,
  yesterday: 'hier',
  daysAgo: (n) => `il y a ${n} jour${n === 1 ? '' : 's'}`,
  weeksAgo: (n) => `il y a ${n} semaine${n === 1 ? '' : 's'}`,
  monthsAgo: (n) => `il y a ${n} mois`,
  yearsAgo: (n) => `il y a ${n} an${n === 1 ? '' : 's'}`,

  inSeconds: (n) => `dans ${n} seconde${n === 1 ? '' : 's'}`,
  inMinutes: (n) => `dans ${n} minute${n === 1 ? '' : 's'}`,
  inHours: (n) => `dans ${n} heure${n === 1 ? '' : 's'}`,
  tomorrow: 'demain',
  inDays: (n) => `dans ${n} jour${n === 1 ? '' : 's'}`,
  inWeeks: (n) => `dans ${n} semaine${n === 1 ? '' : 's'}`,
  inMonths: (n) => `dans ${n} mois`,
  inYears: (n) => `dans ${n} an${n === 1 ? '' : 's'}`,

  durationHours: (n) => `${n} heure${n === 1 ? '' : 's'}`,
  durationMinutes: (n) => `${n} minute${n === 1 ? '' : 's'}`,
  durationSeconds: (n) => `${n} seconde${n === 1 ? '' : 's'}`,
  durationAbout: (time) => `environ ${time}`,

  monthsShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
  monthsFull: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],

  weekdaysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  weekdaysFull: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],

  yesterdayAt: (time) => `Hier à ${time}`,
  tomorrowAt: (time) => `Demain à ${time}`,
  todayAt: (time) => `aujourd'hui à ${time}`,
  at: 'à',
}

// German
export const de: LocaleStrings = {
  justNow: 'gerade eben',
  secondsAgo: (n) => `vor ${n} Sekunde${n === 1 ? '' : 'n'}`,
  minutesAgo: (n) => `vor ${n} Minute${n === 1 ? '' : 'n'}`,
  hoursAgo: (n) => `vor ${n} Stunde${n === 1 ? '' : 'n'}`,
  yesterday: 'gestern',
  daysAgo: (n) => `vor ${n} Tag${n === 1 ? '' : 'en'}`,
  weeksAgo: (n) => `vor ${n} Woche${n === 1 ? '' : 'n'}`,
  monthsAgo: (n) => `vor ${n} Monat${n === 1 ? '' : 'en'}`,
  yearsAgo: (n) => `vor ${n} Jahr${n === 1 ? '' : 'en'}`,

  inSeconds: (n) => `in ${n} Sekunde${n === 1 ? '' : 'n'}`,
  inMinutes: (n) => `in ${n} Minute${n === 1 ? '' : 'n'}`,
  inHours: (n) => `in ${n} Stunde${n === 1 ? '' : 'n'}`,
  tomorrow: 'morgen',
  inDays: (n) => `in ${n} Tag${n === 1 ? '' : 'en'}`,
  inWeeks: (n) => `in ${n} Woche${n === 1 ? '' : 'n'}`,
  inMonths: (n) => `in ${n} Monat${n === 1 ? '' : 'en'}`,
  inYears: (n) => `in ${n} Jahr${n === 1 ? '' : 'en'}`,

  durationHours: (n) => `${n} Stunde${n === 1 ? '' : 'n'}`,
  durationMinutes: (n) => `${n} Minute${n === 1 ? '' : 'n'}`,
  durationSeconds: (n) => `${n} Sekunde${n === 1 ? '' : 'n'}`,
  durationAbout: (time) => `etwa ${time}`,

  monthsShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
  monthsFull: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],

  weekdaysShort: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
  weekdaysFull: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],

  yesterdayAt: (time) => `Gestern um ${time}`,
  tomorrowAt: (time) => `Morgen um ${time}`,
  todayAt: (time) => `heute um ${time}`,
  at: 'um',
}

// Japanese
export const ja: LocaleStrings = {
  justNow: 'たった今',
  secondsAgo: (n) => `${n}秒前`,
  minutesAgo: (n) => `${n}分前`,
  hoursAgo: (n) => `${n}時間前`,
  yesterday: '昨日',
  daysAgo: (n) => `${n}日前`,
  weeksAgo: (n) => `${n}週間前`,
  monthsAgo: (n) => `${n}ヶ月前`,
  yearsAgo: (n) => `${n}年前`,

  inSeconds: (n) => `${n}秒後`,
  inMinutes: (n) => `${n}分後`,
  inHours: (n) => `${n}時間後`,
  tomorrow: '明日',
  inDays: (n) => `${n}日後`,
  inWeeks: (n) => `${n}週間後`,
  inMonths: (n) => `${n}ヶ月後`,
  inYears: (n) => `${n}年後`,

  durationHours: (n) => `${n}時間`,
  durationMinutes: (n) => `${n}分`,
  durationSeconds: (n) => `${n}秒`,
  durationAbout: (time) => `約${time}`,

  monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthsFull: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],

  weekdaysShort: ['日', '月', '火', '水', '木', '金', '土'],
  weekdaysFull: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],

  yesterdayAt: (time) => `昨日 ${time}`,
  tomorrowAt: (time) => `明日 ${time}`,
  todayAt: (time) => `今日 ${time}`,
  at: '',
}

// Chinese (Simplified)
export const zh: LocaleStrings = {
  justNow: '刚刚',
  secondsAgo: (n) => `${n}秒前`,
  minutesAgo: (n) => `${n}分钟前`,
  hoursAgo: (n) => `${n}小时前`,
  yesterday: '昨天',
  daysAgo: (n) => `${n}天前`,
  weeksAgo: (n) => `${n}周前`,
  monthsAgo: (n) => `${n}个月前`,
  yearsAgo: (n) => `${n}年前`,

  inSeconds: (n) => `${n}秒后`,
  inMinutes: (n) => `${n}分钟后`,
  inHours: (n) => `${n}小时后`,
  tomorrow: '明天',
  inDays: (n) => `${n}天后`,
  inWeeks: (n) => `${n}周后`,
  inMonths: (n) => `${n}个月后`,
  inYears: (n) => `${n}年后`,

  durationHours: (n) => `${n}小时`,
  durationMinutes: (n) => `${n}分钟`,
  durationSeconds: (n) => `${n}秒`,
  durationAbout: (time) => `大约${time}`,

  monthsShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthsFull: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],

  weekdaysShort: ['日', '一', '二', '三', '四', '五', '六'],
  weekdaysFull: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],

  yesterdayAt: (time) => `昨天 ${time}`,
  tomorrowAt: (time) => `明天 ${time}`,
  todayAt: (time) => `今天 ${time}`,
  at: '',
}

// Portuguese
export const pt: LocaleStrings = {
  justNow: 'agora mesmo',
  secondsAgo: (n) => `${n} segundo${n === 1 ? '' : 's'} atr\u00e1s`,
  minutesAgo: (n) => `${n} minuto${n === 1 ? '' : 's'} atr\u00e1s`,
  hoursAgo: (n) => `${n} hora${n === 1 ? '' : 's'} atr\u00e1s`,
  yesterday: 'ontem',
  daysAgo: (n) => `${n} dia${n === 1 ? '' : 's'} atr\u00e1s`,
  weeksAgo: (n) => `${n} semana${n === 1 ? '' : 's'} atr\u00e1s`,
  monthsAgo: (n) => `${n} m\u00eas${n === 1 ? '' : 'es'} atr\u00e1s`,
  yearsAgo: (n) => `${n} ano${n === 1 ? '' : 's'} atr\u00e1s`,

  inSeconds: (n) => `em ${n} segundo${n === 1 ? '' : 's'}`,
  inMinutes: (n) => `em ${n} minuto${n === 1 ? '' : 's'}`,
  inHours: (n) => `em ${n} hora${n === 1 ? '' : 's'}`,
  tomorrow: 'amanh\u00e3',
  inDays: (n) => `em ${n} dia${n === 1 ? '' : 's'}`,
  inWeeks: (n) => `em ${n} semana${n === 1 ? '' : 's'}`,
  inMonths: (n) => `em ${n} m\u00eas${n === 1 ? '' : 'es'}`,
  inYears: (n) => `em ${n} ano${n === 1 ? '' : 's'}`,

  durationHours: (n) => `${n} hora${n === 1 ? '' : 's'}`,
  durationMinutes: (n) => `${n} minuto${n === 1 ? '' : 's'}`,
  durationSeconds: (n) => `${n} segundo${n === 1 ? '' : 's'}`,
  durationAbout: (time) => `aproximadamente ${time}`,

  monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
  monthsFull: ['Janeiro', 'Fevereiro', 'Mar\u00e7o', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],

  weekdaysShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'S\u00e1b'],
  weekdaysFull: ['Domingo', 'Segunda-feira', 'Ter\u00e7a-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'S\u00e1bado'],

  yesterdayAt: (time) => `Ontem \u00e0s ${time}`,
  tomorrowAt: (time) => `Amanh\u00e3 \u00e0s ${time}`,
  todayAt: (time) => `hoje \u00e0s ${time}`,
  at: '\u00e0s',
}

// Italian
export const it: LocaleStrings = {
  justNow: 'proprio ora',
  secondsAgo: (n) => `${n} secondo${n === 1 ? '' : 'i'} fa`,
  minutesAgo: (n) => `${n} minut${n === 1 ? 'o' : 'i'} fa`,
  hoursAgo: (n) => `${n} or${n === 1 ? 'a' : 'e'} fa`,
  yesterday: 'ieri',
  daysAgo: (n) => `${n} giorn${n === 1 ? 'o' : 'i'} fa`,
  weeksAgo: (n) => `${n} settiman${n === 1 ? 'a' : 'e'} fa`,
  monthsAgo: (n) => `${n} mes${n === 1 ? 'e' : 'i'} fa`,
  yearsAgo: (n) => `${n} ann${n === 1 ? 'o' : 'i'} fa`,

  inSeconds: (n) => `tra ${n} second${n === 1 ? 'o' : 'i'}`,
  inMinutes: (n) => `tra ${n} minut${n === 1 ? 'o' : 'i'}`,
  inHours: (n) => `tra ${n} or${n === 1 ? 'a' : 'e'}`,
  tomorrow: 'domani',
  inDays: (n) => `tra ${n} giorn${n === 1 ? 'o' : 'i'}`,
  inWeeks: (n) => `tra ${n} settiman${n === 1 ? 'a' : 'e'}`,
  inMonths: (n) => `tra ${n} mes${n === 1 ? 'e' : 'i'}`,
  inYears: (n) => `tra ${n} ann${n === 1 ? 'o' : 'i'}`,

  durationHours: (n) => `${n} or${n === 1 ? 'a' : 'e'}`,
  durationMinutes: (n) => `${n} minut${n === 1 ? 'o' : 'i'}`,
  durationSeconds: (n) => `${n} second${n === 1 ? 'o' : 'i'}`,
  durationAbout: (time) => `circa ${time}`,

  monthsShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
  monthsFull: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],

  weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
  weekdaysFull: ['Domenica', 'Luned\u00ec', 'Marted\u00ec', 'Mercoled\u00ec', 'Gioved\u00ec', 'Venerd\u00ec', 'Sabato'],

  yesterdayAt: (time) => `Ieri alle ${time}`,
  tomorrowAt: (time) => `Domani alle ${time}`,
  todayAt: (time) => `oggi alle ${time}`,
  at: 'alle',
}

// Korean
export const ko: LocaleStrings = {
  justNow: '\uBC29\uAE08',
  secondsAgo: (n) => `${n}\uCD08 \uC804`,
  minutesAgo: (n) => `${n}\uBD84 \uC804`,
  hoursAgo: (n) => `${n}\uC2DC\uAC04 \uC804`,
  yesterday: '\uC5B4\uC81C',
  daysAgo: (n) => `${n}\uC77C \uC804`,
  weeksAgo: (n) => `${n}\uC8FC \uC804`,
  monthsAgo: (n) => `${n}\uAC1C\uC6D4 \uC804`,
  yearsAgo: (n) => `${n}\uB144 \uC804`,

  inSeconds: (n) => `${n}\uCD08 \uD6C4`,
  inMinutes: (n) => `${n}\uBD84 \uD6C4`,
  inHours: (n) => `${n}\uC2DC\uAC04 \uD6C4`,
  tomorrow: '\uB0B4\uC77C',
  inDays: (n) => `${n}\uC77C \uD6C4`,
  inWeeks: (n) => `${n}\uC8FC \uD6C4`,
  inMonths: (n) => `${n}\uAC1C\uC6D4 \uD6C4`,
  inYears: (n) => `${n}\uB144 \uD6C4`,

  durationHours: (n) => `${n}\uC2DC\uAC04`,
  durationMinutes: (n) => `${n}\uBD84`,
  durationSeconds: (n) => `${n}\uCD08`,
  durationAbout: (time) => `\uC57D ${time}`,

  monthsShort: ['1\uC6D4', '2\uC6D4', '3\uC6D4', '4\uC6D4', '5\uC6D4', '6\uC6D4', '7\uC6D4', '8\uC6D4', '9\uC6D4', '10\uC6D4', '11\uC6D4', '12\uC6D4'],
  monthsFull: ['1\uC6D4', '2\uC6D4', '3\uC6D4', '4\uC6D4', '5\uC6D4', '6\uC6D4', '7\uC6D4', '8\uC6D4', '9\uC6D4', '10\uC6D4', '11\uC6D4', '12\uC6D4'],

  weekdaysShort: ['\uC77C', '\uC6D4', '\uD654', '\uC218', '\uBAA9', '\uAE08', '\uD1A0'],
  weekdaysFull: ['\uC77C\uC694\uC77C', '\uC6D4\uC694\uC77C', '\uD654\uC694\uC77C', '\uC218\uC694\uC77C', '\uBAA9\uC694\uC77C', '\uAE08\uC694\uC77C', '\uD1A0\uC694\uC77C'],

  yesterdayAt: (time) => `\uC5B4\uC81C ${time}`,
  tomorrowAt: (time) => `\uB0B4\uC77C ${time}`,
  todayAt: (time) => `\uC624\uB298 ${time}`,
  at: '',
}

// Arabic
export const ar: LocaleStrings = {
  justNow: '\u0627\u0644\u0622\u0646',
  secondsAgo: (n) => `\u0645\u0646\u0630 ${n} ${n === 1 ? '\u062B\u0627\u0646\u064A\u0629' : n === 2 ? '\u062B\u0627\u0646\u064A\u062A\u064A\u0646' : n <= 10 ? '\u062B\u0648\u0627\u0646\u064D' : '\u062B\u0627\u0646\u064A\u0629'}`,
  minutesAgo: (n) => `\u0645\u0646\u0630 ${n} ${n === 1 ? '\u062F\u0642\u064A\u0642\u0629' : n === 2 ? '\u062F\u0642\u064A\u0642\u062A\u064A\u0646' : n <= 10 ? '\u062F\u0642\u0627\u0626\u0642' : '\u062F\u0642\u064A\u0642\u0629'}`,
  hoursAgo: (n) => `\u0645\u0646\u0630 ${n} ${n === 1 ? '\u0633\u0627\u0639\u0629' : n === 2 ? '\u0633\u0627\u0639\u062A\u064A\u0646' : n <= 10 ? '\u0633\u0627\u0639\u0627\u062A' : '\u0633\u0627\u0639\u0629'}`,
  yesterday: '\u0623\u0645\u0633',
  daysAgo: (n) => `\u0645\u0646\u0630 ${n} ${n === 1 ? '\u064A\u0648\u0645' : n === 2 ? '\u064A\u0648\u0645\u064A\u0646' : n <= 10 ? '\u0623\u064A\u0627\u0645' : '\u064A\u0648\u0645'}`,
  weeksAgo: (n) => `\u0645\u0646\u0630 ${n} ${n === 1 ? '\u0623\u0633\u0628\u0648\u0639' : n === 2 ? '\u0623\u0633\u0628\u0648\u0639\u064A\u0646' : n <= 10 ? '\u0623\u0633\u0627\u0628\u064A\u0639' : '\u0623\u0633\u0628\u0648\u0639'}`,
  monthsAgo: (n) => `\u0645\u0646\u0630 ${n} ${n === 1 ? '\u0634\u0647\u0631' : n === 2 ? '\u0634\u0647\u0631\u064A\u0646' : n <= 10 ? '\u0623\u0634\u0647\u0631' : '\u0634\u0647\u0631'}`,
  yearsAgo: (n) => `\u0645\u0646\u0630 ${n} ${n === 1 ? '\u0633\u0646\u0629' : n === 2 ? '\u0633\u0646\u062A\u064A\u0646' : n <= 10 ? '\u0633\u0646\u0648\u0627\u062A' : '\u0633\u0646\u0629'}`,

  inSeconds: (n) => `\u062E\u0644\u0627\u0644 ${n} ${n === 1 ? '\u062B\u0627\u0646\u064A\u0629' : n === 2 ? '\u062B\u0627\u0646\u064A\u062A\u064A\u0646' : n <= 10 ? '\u062B\u0648\u0627\u0646\u064D' : '\u062B\u0627\u0646\u064A\u0629'}`,
  inMinutes: (n) => `\u062E\u0644\u0627\u0644 ${n} ${n === 1 ? '\u062F\u0642\u064A\u0642\u0629' : n === 2 ? '\u062F\u0642\u064A\u0642\u062A\u064A\u0646' : n <= 10 ? '\u062F\u0642\u0627\u0626\u0642' : '\u062F\u0642\u064A\u0642\u0629'}`,
  inHours: (n) => `\u062E\u0644\u0627\u0644 ${n} ${n === 1 ? '\u0633\u0627\u0639\u0629' : n === 2 ? '\u0633\u0627\u0639\u062A\u064A\u0646' : n <= 10 ? '\u0633\u0627\u0639\u0627\u062A' : '\u0633\u0627\u0639\u0629'}`,
  tomorrow: '\u063A\u062F\u0627\u064B',
  inDays: (n) => `\u062E\u0644\u0627\u0644 ${n} ${n === 1 ? '\u064A\u0648\u0645' : n === 2 ? '\u064A\u0648\u0645\u064A\u0646' : n <= 10 ? '\u0623\u064A\u0627\u0645' : '\u064A\u0648\u0645'}`,
  inWeeks: (n) => `\u062E\u0644\u0627\u0644 ${n} ${n === 1 ? '\u0623\u0633\u0628\u0648\u0639' : n === 2 ? '\u0623\u0633\u0628\u0648\u0639\u064A\u0646' : n <= 10 ? '\u0623\u0633\u0627\u0628\u064A\u0639' : '\u0623\u0633\u0628\u0648\u0639'}`,
  inMonths: (n) => `\u062E\u0644\u0627\u0644 ${n} ${n === 1 ? '\u0634\u0647\u0631' : n === 2 ? '\u0634\u0647\u0631\u064A\u0646' : n <= 10 ? '\u0623\u0634\u0647\u0631' : '\u0634\u0647\u0631'}`,
  inYears: (n) => `\u062E\u0644\u0627\u0644 ${n} ${n === 1 ? '\u0633\u0646\u0629' : n === 2 ? '\u0633\u0646\u062A\u064A\u0646' : n <= 10 ? '\u0633\u0646\u0648\u0627\u062A' : '\u0633\u0646\u0629'}`,

  durationHours: (n) => `${n} ${n === 1 ? '\u0633\u0627\u0639\u0629' : n === 2 ? '\u0633\u0627\u0639\u062A\u064A\u0646' : n <= 10 ? '\u0633\u0627\u0639\u0627\u062A' : '\u0633\u0627\u0639\u0629'}`,
  durationMinutes: (n) => `${n} ${n === 1 ? '\u062F\u0642\u064A\u0642\u0629' : n === 2 ? '\u062F\u0642\u064A\u0642\u062A\u064A\u0646' : n <= 10 ? '\u062F\u0642\u0627\u0626\u0642' : '\u062F\u0642\u064A\u0642\u0629'}`,
  durationSeconds: (n) => `${n} ${n === 1 ? '\u062B\u0627\u0646\u064A\u0629' : n === 2 ? '\u062B\u0627\u0646\u064A\u062A\u064A\u0646' : n <= 10 ? '\u062B\u0648\u0627\u0646\u064D' : '\u062B\u0627\u0646\u064A\u0629'}`,
  durationAbout: (time) => `\u062D\u0648\u0627\u0644\u064A ${time}`,

  monthsShort: ['\u064A\u0646\u0627', '\u0641\u0628\u0631', '\u0645\u0627\u0631', '\u0623\u0628\u0631', '\u0645\u0627\u064A', '\u064A\u0648\u0646', '\u064A\u0648\u0644', '\u0623\u063A\u0633', '\u0633\u0628\u062A', '\u0623\u0643\u062A', '\u0646\u0648\u0641', '\u062F\u064A\u0633'],
  monthsFull: ['\u064A\u0646\u0627\u064A\u0631', '\u0641\u0628\u0631\u0627\u064A\u0631', '\u0645\u0627\u0631\u0633', '\u0623\u0628\u0631\u064A\u0644', '\u0645\u0627\u064A\u0648', '\u064A\u0648\u0646\u064A\u0648', '\u064A\u0648\u0644\u064A\u0648', '\u0623\u063A\u0633\u0637\u0633', '\u0633\u0628\u062A\u0645\u0628\u0631', '\u0623\u0643\u062A\u0648\u0628\u0631', '\u0646\u0648\u0641\u0645\u0628\u0631', '\u062F\u064A\u0633\u0645\u0628\u0631'],

  weekdaysShort: ['\u0623\u062D\u062F', '\u0627\u062B\u0646', '\u062B\u0644\u0627\u062B', '\u0623\u0631\u0628\u0639', '\u062E\u0645\u064A\u0633', '\u062C\u0645\u0639\u0629', '\u0633\u0628\u062A'],
  weekdaysFull: ['\u0627\u0644\u0623\u062D\u062F', '\u0627\u0644\u0627\u062B\u0646\u064A\u0646', '\u0627\u0644\u062B\u0644\u0627\u062B\u0627\u0621', '\u0627\u0644\u0623\u0631\u0628\u0639\u0627\u0621', '\u0627\u0644\u062E\u0645\u064A\u0633', '\u0627\u0644\u062C\u0645\u0639\u0629', '\u0627\u0644\u0633\u0628\u062A'],

  yesterdayAt: (time) => `\u0623\u0645\u0633 \u0641\u064A ${time}`,
  tomorrowAt: (time) => `\u063A\u062F\u0627\u064B \u0641\u064A ${time}`,
  todayAt: (time) => `\u0627\u0644\u064A\u0648\u0645 \u0641\u064A ${time}`,
  at: '\u0641\u064A',
}

// Locale registry
export const locales: Record<string, LocaleStrings> = {
  en,
  'en-US': en,
  'en-GB': en,
  es,
  'es-ES': es,
  'es-MX': es,
  fr,
  'fr-FR': fr,
  de,
  'de-DE': de,
  ja,
  'ja-JP': ja,
  zh,
  'zh-CN': zh,
  pt,
  'pt-BR': pt,
  'pt-PT': pt,
  it,
  'it-IT': it,
  ko,
  'ko-KR': ko,
  ar,
  'ar-SA': ar,
  'ar-EG': ar,
}

/**
 * Get locale strings for a given locale code
 */
export function getLocale(code: string): LocaleStrings {
  return locales[code] || locales[code.split('-')[0]] || en
}

/**
 * Register a custom locale
 */
export function registerLocale(code: string, strings: LocaleStrings): void {
  locales[code] = strings
}
