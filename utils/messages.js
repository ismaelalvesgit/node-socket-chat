//@Author ismael alves
import moment from 'moment'

export default function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}