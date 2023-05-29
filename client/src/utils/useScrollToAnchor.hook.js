import { useNavigate } from "react-router-dom";

export const useScrollToAnchor = () => {
  const navigate = useNavigate()
  return function (id) {
    const elem = document.getElementById(id)

    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
      navigate(`#${id}`);
    }
  }
};