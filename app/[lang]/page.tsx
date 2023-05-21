import Demo from '@/components/Demo'
import { getDictionary } from '@/lib/get-dictionary'
import { Locale } from '@/config/i18n-config'
import { Dictionary } from '@/types'
export default async function Home({ params: { lang },
}: {
  params: { lang: Locale }
}) {

  const dictionary:Dictionary = await getDictionary(lang)
  return (
    <section className='w-full flex justify-center items-center flex-col '>
      <h1 className=' md:text-5xl font-heading max-w-prose leading-[50px]  justify-center text-foreground text-3xl text-center  mt-10 '> <br className='max-md:hidden' /><p>{dictionary['banner'].text}</p>
        <span className='bg-gradient-to-r from-amber-500 via-orange-600 to-yellow-500  bg-clip-text text-transparent '>SUMZ</span>
      </h1>
      <h2 className='mt-5 text-lg text-muted-foreground sm:text-xl text-center max-w-2xl px-4 md:px-0'>
      {dictionary['banner'].paragraph}
      </h2>
      <Demo dictionary={dictionary.demo}/>
    </section>
  )
}
