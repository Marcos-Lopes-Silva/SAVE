import { BsInputCursorText, BsTextareaResize } from "react-icons/bs"; 
import { IoMdRadioButtonOn, IoIosStarOutline } from "react-icons/io";
import styles from './IndexList.module.css';

const size = 25;
const color = "white"

const inputTypes = [
  {
    "id": 1,
    "type": "text",
    "title": "Text Input",
    "icon": <BsInputCursorText size={size} color={color}/>
  },
  {
    "id": 2,
    "type": "textarea",
    "title": "Text Area",
    "icon": <BsTextareaResize size={size} color={color}/>
  },
  {
    "id": 3,
    "type": "radiogroup",
    "title": "Radio Group",
    "icon": <IoMdRadioButtonOn  size={size} color={color}/>
  },
  {
    "id": 4,
    "type": "rating",
    "title": "Rating Scale",
    "icon": <IoIosStarOutline size={size} color={color}/>
  },
  {
    "id": 5,
    "type": "checkbox",
    "title": "Checkbox",
    "options": ["Opção 1", "Opção 2", "Opção 3"],
    "icon": <BsTextareaResize size={size} color={color}/>
  },
  {
    
    "id": 6,
    "type": "number",
    "title": "Input de Número",
    "placeholder": "Digite um número",
    "icon": <BsTextareaResize size={size} color={color}/>

  },
  {
    "id": 7,
    "type": "select",
    "title": "Select",
    "options": ["Opção 1", "Opção 2", "Opção 3"],
    "icon": <BsTextareaResize size={size} color={color}/>
  }
]

export default function InputList({addQuestion, ...props}) {
    return (
      <div className={styles.bob}>
        {inputTypes.map((item) => (
            <button key={item.id} className={styles.container} onClick={() => addQuestion(item.type)}>
              <span className={styles.input_icon}>{item.icon}</span>
              <span className={styles.input_title}>{item.title}</span>
            </button>
          ))}
      </div>
    )
}