import React from "react";
import { useNavigate } from "react-router-dom";

function BackButton({ to }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to); //  전달받은 경로로 이동
    } else {
      navigate(-1); //  없으면 뒤로가기 기본 동작
    }
  };

  return (
    <button className="btn btn-outline-primary mt-3 ms-3" onClick={handleClick}>
      <i className="bi bi-arrow-left me-2"></i> 뒤로가기
    </button>
  );
}

export default BackButton;
