
const Button = (props:any) => {
  const { text, onClick } = props;

  const onClickHandler = (event:any) => {
    onClick?.(event);
  };

  return (
    <button className="btn" onClick={onClickHandler}>
      {text}
    </button>
  );
};

export default Button;