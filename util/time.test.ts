import { calculateTick } from "./time"

jest.useFakeTimers()
jest.spyOn(global, "setInterval")

describe("time.ts", () => {
    it("calculateTick", () => {
        let timerDone = false
        const callback = jest.fn()

        calculateTick(5, new Date(), callback)
        expect(callback).not.toBeCalled()
        jest.runAllTimers()
        expect(callback).toBeCalled()
        // expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 200)

    })
})