import React from 'react'
import renderer from 'react-test-renderer'
import {Text} from 'react-native'
import Tips from './Tips'
import MainScreen from '../screens/MainScreen'
import Timer from './Timer'
import Enzyme, { shallow, configure } from 'enzyme'

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

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
        
        const testText = shallow(component)
            .find("Text")
        expect(testText.first().props().children).toEqual("20")
        expect(testText.at(1).props().children).toEqual(":")
        expect(testText.at(2).props().children).toEqual("00")
        // expect(button.contains(<Text testID='test'>Hello</Text>)).toBeTruthy()
        // const button = shallow(component).find("button").first().props().onPress()
    })

    it("counts down correctly", () => {
        
    })

})