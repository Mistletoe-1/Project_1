const paths = {
  grid: 'M4 5.5A1.5 1.5 0 0 1 5.5 4h3A1.5 1.5 0 0 1 10 5.5v3A1.5 1.5 0 0 1 8.5 10h-3A1.5 1.5 0 0 1 4 8.5v-3Zm10 0A1.5 1.5 0 0 1 15.5 4h3A1.5 1.5 0 0 1 20 5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 14 8.5v-3ZM4 15.5A1.5 1.5 0 0 1 5.5 14h3a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 8.5 20h-3A1.5 1.5 0 0 1 4 18.5v-3Zm10 0a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3Z',
  receipt: 'M7 3h10a2 2 0 0 1 2 2v16l-3-1.7-3 1.7-3-1.7-3 1.7-3-1.7V5a2 2 0 0 1 2-2Zm2 5h6m-6 4h6m-6 4h4',
  box: 'M4 8.5 12 4l8 4.5V16l-8 4.5L4 16V8.5Zm8 4.5 8-4.5M12 13 4 8.5M12 13v7.5',
  users: 'M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19m8-12.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm8 12.5v-1a3 3 0 0 0-2.2-2.9M15 4.3a3 3 0 0 1 0 5.4',
  spark: 'M13 3 11.5 8.5 6 10l5.5 1.5L13 17l1.5-5.5L20 10l-5.5-1.5L13 3ZM5 15l-.8 2.2L2 18l2.2.8L5 21l.8-2.2L8 18l-2.2-.8L5 15Z',
  search: 'M11 19a8 8 0 1 1 5.3-14 8 8 0 0 1 0 11.9L21 21',
  bell: 'M18 16H6l1.2-2.1V10a4.8 4.8 0 0 1 9.6 0v3.9L18 16Zm-7.5 3h3',
  plus: 'M12 5v14M5 12h14',
  close: 'M6 6l12 12M18 6 6 18',
  filter: 'M4 6h16M7 12h10M10 18h4',
  trend: 'M4 16 9 11l4 4 7-8',
  chevron: 'M9 6l6 6-6 6',
  check: 'M5 12.5 9.2 16 19 7'
};

export default function Icon({ name, size = 20 }) {
  return (
    <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
