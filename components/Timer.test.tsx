import React from 'react'
import renderer from 'react-test-renderer'

import Timer from './Timer'

jest.useFakeTimers()
jest.spyOn(global, "setInterval")

test("<Timer/>", () => {
    const tree = renderer.create(<Timer/>).toJSON()

})