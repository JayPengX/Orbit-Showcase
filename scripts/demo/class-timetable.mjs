// The made-up timetable the Class demo opens on: a senior-high week with
// made-up teachers and rooms, in the shape Class keeps (its MAP.md's
// classFocusData). Never anyone's real timetable.
const T = (subject, teacher, room) => ({ subject, teacher, room });
const SUBJECTS = {
  國文: T('國文', '陳老師', '301'),
  英文: T('英文', '林老師', '301'),
  數學: T('數學', '王老師', '301'),
  物理: T('物理', '張老師', '物理實驗室'),
  化學: T('化學', '李老師', '化學實驗室'),
  歷史: T('歷史', '黃老師', '301'),
  地理: T('地理', '吳老師', '301'),
  公民: T('公民', '劉老師', '301'),
  體育: T('體育', '蔡老師', '操場'),
  音樂: T('音樂', '楊老師', '音樂教室'),
  班會: T('班會', '陳老師', '301'),
  自主: T('自主學習', '', '圖書館')
};

export const timetable = {
  teacherDB: Object.fromEntries(Object.entries(SUBJECTS).map(([k, s]) => [k, [s.subject, s.teacher, '']])),
  teacherOrder: Object.keys(SUBJECTS),
  locationDB: Object.fromEntries(Object.entries(SUBJECTS).map(([k, s]) => [k, s.room])),
  weeklySchedule: {
    0: [],
    1: ['國文', '國文', '數學', '英文', '物理', '歷史', '體育', '自主'],
    2: ['英文', '數學', '化學', '化學', '國文', '地理', '公民', '自主'],
    3: ['數學', '物理', '英文', '國文', '音樂', '體育', '班會', ''],
    4: ['化學', '英文', '國文', '數學', '歷史', '地理', '自主', '自主'],
    5: ['物理', '物理', '數學', '英文', '國文', '公民', '體育', ''],
    6: []
  },
  bellTimes: [
    ['08:10', '09:00'],
    ['09:10', '10:00'],
    ['10:10', '11:00'],
    ['11:10', '12:00'],
    ['13:10', '14:00'],
    ['14:10', '15:00'],
    ['15:10', '16:00'],
    ['16:10', '17:00']
  ],
  breakTimes: [],
  countdownEvents: [{ name: '116 學測', startDate: '2027-01-22', endDate: '2027-01-24' }],
  reverseWeek: false,
  proAccent: '#0A84FF',
  proSecondary: '#5856D6',
  styleSlots: []
};
