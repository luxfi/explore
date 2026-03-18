
import { AccordionItem, AccordionItemTrigger, AccordionItemContent } from 'toolkit/chakra/accordion';

interface Props {
  question: string;
  answer: string;
}

const GasTrackerFaqItem = ({ question, answer }: Props) => {
  return (
    <AccordionItem value={ question }>
      <AccordionItemTrigger variant="faq" >
        { question }
      </AccordionItemTrigger>
      <AccordionItemContent className="pb-4 px-0">
        <span color="text.secondary">{ answer }</span>
      </AccordionItemContent>
    </AccordionItem>
  );
};

export default GasTrackerFaqItem;
