const ActionButton = () => {};
export default ActionButton;

/*
interface ActionButtonViewModel{
  action: Function,
  onActionOccured: Function,
}

const ActionButton: FC = (props:ActionButtonViewModel) => {

  const {action, onActionOccured} = props;

  let isDisabled = false;

  try{
    action()
  }
  catch(e){
    isDisabled = true;
  }

  return (
    <button
      className="e-button m-down"
      disabled={isDisabled}

      onClick={()=>{
        onActionOccured(action)
      }}
    >
      ▼
    </button>
  );
}

*/
