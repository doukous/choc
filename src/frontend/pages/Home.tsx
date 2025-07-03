import { NavLink } from "react-router"

export default function Home() {
  return (
    <>
      home, go to <NavLink to="/timer">timer</NavLink>
    </>
  )
}