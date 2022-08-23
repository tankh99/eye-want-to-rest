import React from 'react'
import renderer from 'react-test-renderer'
import {Text} from 'react-native'
import Tips from './Tips'
import MainScreen from '../screens/MainScreen'
import Timer from './Timer'
import Enzyme, { shallow, configure, mount } from 'enzyme'

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import EyeButton from './EyeButton'

jest.useFakeTimers()
jest.spyOn(global, "setInterval")

Enzyme.configure({ adapter: new Adapter() });


const DEFAULT_SESSION_DURATION = new Date(0,0,0,0,20,0)
describe("<Timer/>", () => {
    it("renders correctly", () => {
        const tree = renderer.create(
            <Timer sessionDuration={DEFAULT_SESSION_DURATION}
                    startTime={new Date()}
                    setShowExercises={() => {}}
                    eyeOpen={false}
                    setEyeOpen={() => {}}
                    setExercise={() => {}}
                    navigation={{}}
                />
        )
        expect(tree).toMatchSnapshot()
    })

    it("shows correct time", () => {
        
        const component = <Timer sessionDuration={DEFAULT_SESSION_DURATION}
            startTime={new Date()}
            setShowExercises={() => {}}
            eyeOpen={true}
            setEyeOpen={() => {}}
            setExercise={() => {}}
            navigation={{}}
        />
        // const button = shallow(component).findWhere((node) => node.prop("testID") == "test")
        
        const time = shallow(component)
            .find("Text")
        expect(time.first().props().children).toEqual("20")
        expect(time.at(1).props().children).toEqual(":")
        expect(time.at(2).props().children).toEqual("00")
        // expect(button.contains(<Text testID='test'>Hello</Text>)).toBeTruthy()
        // const button = shallow(component).find("button").first().props().onPress()
    })

    it("counts down correctly", () => {
        const navigation = jest.fn()
        const route = jest.fn()
        const component = mount(<MainScreen navigation={navigation} route={route} />)


        // const component = shallow(<Timer sessionDuration={DEFAULT_SESSION_DURATION}
        //     startTime={new Date()}
        //     setShowExercises={() => {}}
        //     eyeOpen={true}
        //     setEyeOpen={() => {}}
        //     setExercise={() => {}}
        //     navigation={{}}
        // />)
        

        const button = component.find(EyeButton)
        console.log(button.debug())
        button.simulate("press")
        expect(button.props().toggleEye).toBeCalled()
        // console.log(button.debug())
        // jest.advanceTimersByTime(19 * 60 * 1000)
        const time = component.find("Text")
        console.log(time.debug())
        // expect(time.first().props().children).toEqual("01")
        // expect(time.at(1).props().children).toEqual(":")
        // expect(time.at(2).props().children).toEqual("00")
    })

    it("Sends notifications", () => {
        
    })
})
