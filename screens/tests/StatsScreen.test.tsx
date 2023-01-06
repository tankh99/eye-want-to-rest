import StatsScreen, { groupDates } from "../StatsScreen";
import Enzyme, { shallow } from 'enzyme';
import renderer from 'react-test-renderer'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import {add, isThisWeek, startOfWeek} from 'date-fns'
import { getMonday } from "../../util/time";
import { insertHistory, readHistory, TEST_DB_NAME } from "../../util/sqlite";
import { openDatabase } from "expo-sqlite";
import {Database} from 'expo-sqlite'

jest.mock("../../util/sqlite.ts")

Enzyme.configure({ adapter: new Adapter() });

describe("<StatsScreen/>", () => {
    it("displays weekly stats from Monday - Sunday", async () => {
        

        const daysOfWeek = [];
        const now = add(new Date(), {days: 0});
        const monday = getMonday(now)
        for(let i = 0; i < 7; i++){
            const dayOfWeek = add(monday, {days: i})
            // if(isThisWEe)
            daysOfWeek.push(JSON.stringify(dayOfWeek))
            insertHistory(TEST_DB_NAME, dayOfWeek, 20 * 60)
            
        }
        const list = await readHistory(TEST_DB_NAME);
        console.log(list);
        
        // const result = groupDates(daysOfWeek);
        // console.log(result);

        // const component = shallow(<StatsScreen/>)
        // component.invoke("groupDates");
        // fireEvent

        // console.log(daysOfWeek);
        // console.log(daysOfWeek.forEach((day) => day.getDay()))
        // let allInWeek = true;
        // for(let date of daysOfWeek){
        //     if(!isThisWeek(date, {weekStartsOn: 1})){
        //         allInWeek = false;
        //         console.log("Failed at ", date)
        //     }
        // }
        // expect(allInWeek).toBe(true);
    })  
})