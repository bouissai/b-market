import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FAQ_DATA } from "@/constants";

export function Faq() {

    return (
        <section id="faq">
            <div>
                <h1 className="text-2xl font-bold mb-6" >Foire aux questions</h1>
                <div className="relative z-10 flex justify-between items-center px-12 ">
                    <Accordion className="min-w-full w-full" type="single" collapsible>
                        {FAQ_DATA.map((item, index) => (
                            <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger className="text-2xl">{item.question}</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-lg text-left">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    )


}