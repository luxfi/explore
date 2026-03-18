
import { route } from 'nextjs-routes';

import { Button } from 'toolkit/chakra/button';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Image } from 'toolkit/chakra/image';
import { LinkOverlay, LinkBox } from 'toolkit/chakra/link';

type Props = {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  imageUrl: string;
  darkImageUrl: string;
};

const EssentialDappCard = ({ id, title, description, buttonText, imageUrl, darkImageUrl }: Props) => {
  const imageSrc = useColorModeValue(imageUrl, darkImageUrl);

  return (
    <LinkBox
      className="flex flex-col items-start flex-1 md:flex-none min-w-[130px] max-w-[160px] md:max-w-[200px] w-auto md:w-[200px] p-3 md:p-5 border border-solid border-black/30 dark:border-white/30 rounded-[var(--radius-base,8px)] hover:shadow-md focus-within:shadow-md group"
    >
      <Image src={ imageSrc } alt={ title } h={{ base: '37px', md: '50px' }} mb={ 6 }/>
      <span textStyle={{ base: 'sm', md: 'xl' }} fontWeight="600" mb={ 2 }>{ title }</span>
      <span textStyle={{ base: 'xs', md: 'sm' }} mb={ 3 }>{ description }</span>
      <LinkOverlay
        href={ route({ pathname: '/essential-dapps/[id]', query: { id } }) }
        className="w-full md:w-auto mt-auto"
      >
        <Button size="sm" variant="outline" className="w-full group-hover:border-[var(--color-hover)] group-hover:text-[var(--color-hover)]">
          { buttonText }
        </Button>
      </LinkOverlay>
    </LinkBox>
  );
};

export default EssentialDappCard;
