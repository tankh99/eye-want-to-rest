
const ASSET_PATH = "../assets/exercises"

export interface Exercise {
    name: string,
    description: string,
    images: any[],
    steps: string[],
    approximateDuration: number,
    frequency: number,
    reference: string,
    credit?: string
}

export const exercises: Exercise[] = [

    {
        name: "20-20-20",
        description: `
            Every 20 minutes, look at something 20 feet away (6m) for 20 seconds
        `,
        images: [require(`${ASSET_PATH}/20-20-20.jpeg`)],
        steps: [
            "Focus on something 20 feet away (6m). Try looking out the window for a far away tree or building",
            "Focus on the object for 20 seconds"
        ],
        approximateDuration: 20,
        frequency: 5,
        credit: `https://unsplash.com/@dylanferreira?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText`,
        reference: "https://youtu.be/_7hwZv36JMU"
    },
    {
        name: "Pencil Pushups",
        description: `
            Alternate your focus on an object near and an object far
        `,
        images: [require(`${ASSET_PATH}/pencil-pushup.jpeg`)],
        credit: "https://healthandbeautytipsz.blogspot.com/2014/10/how-to-improve-your-vision-naturally.html",
        steps: [
            "Hold a pencil or your pointer finger at arms' length away and focus on a target point. The point you are focusing on should be detailed",
            "Slowly move the object closer to your eyes until it starts becoming blurry.",
            "Stop just a few cm away from your face. Try to focus such that it doesn't look blurry.",
            "After a few seconds, look far away to relax your eyes",
            "Return your focus back to the object, then slowly move it away from your eyes as you maintain focus throughout",
            "Repeat three times"
        ],
        approximateDuration: 60,
        frequency: 4,
        reference: "https://youtu.be/BuvMrCAt6TU"
    },
    {
        name: "Palm your Eyes",
        description: `
            Cover your eyes with your palms
        `,
        images: [require(`${ASSET_PATH}/eye-palm.jpeg`)],
        credit: "https://www.carechef.in/five-ways-to-sharpen-eyesight/",
        steps: [

            "Rub your hands together",
            "Cover your eyes with your palms lightly.",
            "Feel the heat of your palms, but avoid applying pressure",
            "Repeat until your eyes feel relaxed"
        ],
        approximateDuration: 30,
        frequency: 4,
        reference: "https://youtu.be/RoIYAoAalmI"
    },
    {
        name: "Massage your Eyes",
        description: `
            Best for people with dry eyes
        `,
        images: [require(`${ASSET_PATH}/massage-eyes.png`)],
        credit: "https://www.wikihow.com/Exercise-Your-Eyes",
        steps: [
            "Close your eyes and push down the top eyelid lightly using a finger. Push downward from the left of your eyelid to the right of the eyelid",
            "Repeat for the bottom eyelid. Look upwards and massage from the bottom-up.",
            "Ensure to massage the corners of your eyes",
            "Repeat for the other eye"
        ],
        approximateDuration: 180,
        frequency: 3,
        reference: "https://youtu.be/bGJqucoHmjs"
    },
    // ADVANCED
    // {
    //     name: "Bates' Method: Palming",
    //     description: `
    //         Complete relaxation for your eyes
    //     `,
    //     images: [require(`${ASSET_PATH}/palm-eyes.png`)],
    //     steps: [
    //         "Cover your eyes with your palms such that you're able to still open your eyes and look around.",
    //         "Ensure that your eyes can see no light",
    //         "Allow yourself to relax for at least a minute or more",
    //         "When ready, close your eyes and then open up your palms. Turn towards darkness, then slowly open up your eyes",
    //     ],
    //     approximateDuration: 60,
    //     frequency: 4,
    //     reference: "https://youtu.be/oI2qmqhcr_4"
    // },
    {
        name: "Figure Eight",
        description: `
            Make an imaginary figure eight with your eyes
        `,
        images: [require(`${ASSET_PATH}/figure-eight.png`)],
        steps: [
            "Trace an imaginary giant figure eight on an open surface. It should be about 3 metres in front of you",
            "Trace the figure eight with your eyes and focus at objects that are at the edge of your vision. Do not move your head as you do so",
            "Trace 10 times, then switch directions",
        ],
        approximateDuration: 60,
        frequency: 2,
        reference: "https://youtu.be/mqXR8O2VJLo?t=183",
        credit: "https://www.wikihow.com/Exercise-Your-Eyes"
    },
    {
        name: "Directional Eyes",
        description: `
            Look up, down, left and right. 
        `,
        images: [require(`${ASSET_PATH}/directional-eye-exercises.jpeg`)],
        credit: "https://www.wikihow.com/Exercise-Your-Eyes",
        steps: [
            "Stand or sit upright. Look straight ahead",
            "Without moving your head, look to the left, focus on what you see, then look to the right. Move your eyes side to side 3 times",
            "Repeat the above step, but up and down 3 times",
            "Repeat the above step, but diagonally 3 times"
        ],
        approximateDuration: 30,
        frequency: 4,
        reference: "https://youtu.be/mqXR8O2VJLo"

    }
]

let weightedExercises: any = []
export function getWeightedExercises(){
    if(!weightedExercises){
        for(let exercise of exercises){
            for(let i = 0; i < exercise.frequency; i++){
                weightedExercises.push(exercise)
            }
        }
    }
    console.log("weighted exericses", weightedExercises)
    return weightedExercises
}