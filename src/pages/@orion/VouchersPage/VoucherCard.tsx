export interface VoucherProps {
  id: string,
  code: string
  validity: number
  value: string
}

function addYears(date: Date, years: number) {
  date.setFullYear(date.getFullYear() + years);
  return date;
}

const VoucherCard = (props: VoucherProps) => {
  const { code, validity, value } = props;
  return <div className="flex flex-row rounded-md justify-between w-[500px]">
    <div>
      <div className="flex items-center">
        <div className="p-2.5 my-2.5">
          <svg viewBox="23.1454 14.5838 61.6 61.75" xmlns="http://www.w3.org/2000/svg" width={48} height={48}>
            <g transform="matrix(1, 0, 0, 1, 3.995434045791626, -4.566209793090822)">
              <path d="M76.5,42.9l0.5-7.8c0-0.4-0.2-0.8-0.5-1l-7-3.5l-3.5-7c-0.2-0.4-0.6-0.6-1-0.5l-7.8,0.5l-6.6-4.3c-0.3-0.2-0.8-0.2-1.1,0   l-6.6,4.3L35.1,23c-0.4,0-0.8,0.2-1,0.5l-3.5,7l-7,3.5c-0.4,0.2-0.6,0.6-0.5,1l0.5,7.8l-4.3,6.6c-0.2,0.3-0.2,0.8,0,1.1l4.3,6.6   L23,64.9c0,0.4,0.2,0.8,0.5,1l7,3.5l3.5,7c0.2,0.4,0.6,0.6,1,0.5l7.8-0.5l6.6,4.3c0.2,0.1,0.4,0.2,0.5,0.2s0.4-0.1,0.5-0.2l6.6-4.3   l7.8,0.5c0.4,0,0.8-0.2,1-0.5l3.5-7l7-3.5c0.4-0.2,0.6-0.6,0.5-1l-0.5-7.8l4.3-6.6c0.2-0.3,0.2-0.8,0-1.1L76.5,42.9z M74.7,56.3   c-0.1,0.2-0.2,0.4-0.2,0.6l0.4,7.5l-6.7,3.4c-0.2,0.1-0.3,0.3-0.4,0.4l-3.4,6.7l-7.5-0.4c-0.2,0-0.4,0-0.6,0.2L50,78.8l-6.3-4.1   c-0.2-0.1-0.4-0.2-0.5-0.2c0,0,0,0-0.1,0l-7.5,0.4l-3.4-6.7c-0.1-0.2-0.3-0.3-0.4-0.4l-6.7-3.4l0.4-7.5c0-0.2,0-0.4-0.2-0.6   L21.2,50l4.1-6.3c0.1-0.2,0.2-0.4,0.2-0.6l-0.4-7.5l6.7-3.4c0.2-0.1,0.3-0.3,0.4-0.4l3.4-6.7l7.5,0.4c0.2,0,0.4,0,0.6-0.2l6.3-4.1   l6.3,4.1c0.2,0.1,0.4,0.2,0.6,0.2l7.5-0.4l3.4,6.7c0.1,0.2,0.3,0.3,0.4,0.4l6.7,3.4l-0.4,7.5c0,0.2,0,0.4,0.2,0.6l4.1,6.3   L74.7,56.3z"/>
              <path d="M42.2,47.7c3.6,0,6.4-2.9,6.4-6.4c0-3.5-2.9-6.4-6.4-6.4c-3.6,0-6.4,2.9-6.4,6.4C35.8,44.8,38.7,47.7,42.2,47.7z    M42.2,36.8c2.4,0,4.4,2,4.4,4.4c0,2.4-2,4.4-4.4,4.4s-4.4-2-4.4-4.4C37.8,38.8,39.8,36.8,42.2,36.8z"/>
              <path d="M57.8,52.3c-3.6,0-6.4,2.9-6.4,6.4c0,3.5,2.9,6.4,6.4,6.4c3.6,0,6.4-2.9,6.4-6.4C64.2,55.2,61.3,52.3,57.8,52.3z    M57.8,63.2c-2.4,0-4.4-2-4.4-4.4c0-2.4,2-4.4,4.4-4.4s4.4,2,4.4,4.4C62.2,61.2,60.2,63.2,57.8,63.2z"/>
              <rect x="31.9" y="49" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -20.7107 50)" width="36.3" height="2"/>
            </g>
          </svg>
        </div>
        <div className="px-3">
          <div className="flex items-center text-sm leading-none">
            <p className="font-semibold text-gray-800">{code}</p>
          </div>
          <div className="text-xs md:text-sm leading-none text-gray-600">{`Valid to: ${addYears(new Date(validity), 3).toLocaleDateString("de", {year: 'numeric', month: '2-digit', day: '2-digit'})}`}</div>
        </div>
      </div>
    </div>
    <div className="p-4 border border-slate-300">
      <div>
        <p className="text-sm font-semibold leading-none text-right text-gray-800">{`€ ${value}`}</p>
        <div className="flex items-center justify-center px-2 py-1 mt-2 bg-green-100 rounded-full">
          <p className="text-xs m-0 text-green-700">Valid</p>
        </div>
      </div>
    </div>
  </div>
}

export default VoucherCard;
