import RiveOptionButton from "./RiveOptionButton";

interface RiveOptionsContainerProps {
  buttonCollectionName: string;
  numOptions: number;
}

const getArtboardName = (artboardName: String) => {
  if (artboardName === "BackgroundColor") {
    return `${artboardName}Button`;
  }
  return `Body${artboardName}Button`;
};

/**
 * List out all the character feature option buttons
 */
export default function RiveOptionsContainer({
  buttonCollectionName,
  numOptions,
}: RiveOptionsContainerProps) {
  const optionButtons = [];
  for (let i = 0; i < numOptions; i++) {
    optionButtons.push(
      <RiveOptionButton
        key={`RiveOptionButton-${buttonCollectionName}-${i}`}
        artboardName={getArtboardName(buttonCollectionName)}
        optionIdx={i}
      />
    );
  }
  return (
    <div className="w-full max-h-[50vh] md:max-h-[100%] h-[calc(100%-3.5rem)] md:h-[calc(100%-6rem)] mx-auto md:p-3 py-3">
      <div className="h-fit gap-x-1 gap-y-px grid grid-cols-[repeat(auto-fill,_minmax(150px,_1fr))]">
        {optionButtons.map((buttonComp) => buttonComp)}
      </div>
    </div>
  );
}
