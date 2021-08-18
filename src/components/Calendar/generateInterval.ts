import { eachDayOfInterval, format, parseISO } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';
import { MarkedDateProps, DayProps } from '.';
import { getPlatformDate } from '../../utils/getPlatformDate';
import theme from '../../styles/theme';

export function generateInterval(start: DayProps, end: DayProps){
  let interval: MarkedDateProps = {};
  const newStart = parseISO(start.dateString)
  const newEnd = parseISO(end.dateString)

  

  eachDayOfInterval({ start: newStart, end: newEnd})
  .forEach(( item ) => {
    const date = format(getPlatformDate(item), 'yyyy-MM-dd');

    interval = {
      ...interval,
      [date]: {
        color: start.dateString === date || end.dateString === date
        ? theme.colors.main.primary : theme.colors.main.light,

        textColor: start.dateString === date || end.dateString === date
        ? theme.colors.main.light : theme.colors.main.primary,        
      }
    }
  });

  return interval;
}