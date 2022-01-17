import { InputHTMLAttributes } from 'react';

import './styles.scss'

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input(props: InputProps) {
  return(
    <input {...props} />
  )
}