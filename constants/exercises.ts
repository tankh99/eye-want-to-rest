
const ASSET_PATH = "../assets/exercises"
// importance (0-5)


export const exercises = [

    {
        name: "20-20-20",
        description: `
            Every 20 minutes, look at something 20 feet away (6m) for 20 seconds
        `,
        images: [require(`${ASSET_PATH}/20-20-20.jpeg`)],
        steps: [
            "Focus on something 20 feet away (6m). Try looking out the window for a far away tree or building",
            "Focus on the object for 20 seconds",
            "Afterwards, palm your eyes to relax them"
        ],
        approximateDuration: 60,
        importance: 5,
        credit: `Photo by <a href="https://unsplash.com/@dylanferreira?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Dylan Ferreira</a> on <a href="https://unsplash.com/s/photos/guy-looking-out-window?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`,
        reference: "https://youtu.be/_7hwZv36JMU"
    },
    {
        name: "Pencil Pushup",
        description: `
            Alternate your focus on an object near and an object far
        `,
        images: [require(`${ASSET_PATH}/focus-change-near.png`), require(`${ASSET_PATH}/focus-change-far.png`)],
        credit: "via https://www.wikihow.com/Exercise-Your-Eyes",
        steps: [
            "Hold a pencil or your pointer finger close to your eye and focus on it.",
            "Slowly move your finger away from your face while maintaining focus.",
            "Look away for a moment and focus something in the distance",
            "Repeat three times"
        ],
        approximateDuration: 60,
        importance: 4,
        reference: "https://youtu.be/BuvMrCAt6TU"
    },
    {
        name: "Palm your Eyes",
        description: `
            Cover your eyes with your palms
        `,
        images: [require(`${ASSET_PATH}/palm-eyes.png`)],
        credit: "https://www.wikihow.com/Exercise-Your-Eyes",
        steps: [

            "Rub your hands together",
            "Cover your eyes with your palms lightly.",
            "Feel the heat of your palms, but avoid applying pressure",
            "Take deep breaths slowly and evenly while thinking of a calm scene"
        ],
        approximateDuration: 30,
        importance: 4,
        reference: "https://youtu.be/RoIYAoAalmI"
    },
    {
        name: "Bates' Method: Palming",
        description: `
            Complete relaxation for your eyes
        `,
        images: [require(`${ASSET_PATH}/palm-eyes.png`)],
        steps: [
            "Cover your eyes with your palms such that you're able to still open your eyes and look around.",
            "Ensure that your eyes can see no light",
            "Allow yourself to relax for at least a minute or more",
            "When ready, close your eyes and then open up your palms. Turn towards darkness, then slowly open up your eyes",
        ],
        approximateDuration: 60,
        importance: 4,
        reference: "https://youtu.be/oI2qmqhcr_4"
    },
    {
        name: "Massage your Eyes",
        description: `
            Best for people with dry eyes
        `,
        images: [require(`${ASSET_PATH}/massage-eyes.png`)],
        credit: "https://www.wikihow.com/Exercise-Your-Eyes",
        steps: [
            "Wash your hands with soap first",
            "Close your eyes and push down the top eyelid lightly using a finger. Ensure to push downward from the left of your eyelid to the right of the eyelid",
            "Repeat for the bottom eyelid. Look upwards and massage from the bottom-up.",
            "Ensure to massage the corners of your eyes",
            "Repeat for your other eye"
        ],
        approximateDuration: 300,
        importance: 4,
        reference: "https://youtu.be/bGJqucoHmjs"
    },
    {
        name: "Figure Eight",
        description: `
            Make an imaginary figure eight with your eyes
        `,
        images: [require(`${ASSET_PATH}/figure-eight.png`)],
        credit: "https://www.wikihow.com/Exercise-Your-Eyes",
        steps: [
            "Imagine a giant figure eight on the floor or on the roof. It should be about 3 metres in front of you",
            "Trace the figure eight with your eyes",
            "Trace 10 times, then switch directions"
        ],
        approximateDuration: 60,
        importance: 2,
        exercise: "https://youtu.be/IZr22jXakeo"
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
        approximateDuration: 60,
        importance: 2,
        reference: "https://youtu.be/mqXR8O2VJLo"

    }
]

let weightedExercises: any = []
export function getWeightedExercises(){
    if(!weightedExercises){
        for(let exercise of exercises){
            for(let i = 0; i < exercise.importance; i++){
                weightedExercises.push(exercise)
            }
        }
    }
    console.log("weighted exericses", weightedExercises)
    return weightedExercises
}