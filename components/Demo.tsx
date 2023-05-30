"use client"
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { translateArticle } from '@/lib/utils';
import { Copy, Link2Icon, Loader } from 'lucide-react';
import { useLazyGetSummaryQuery } from '@/services/article';
interface DemoProps {
  dictionary: {
    place_holder: string;
    button_children: string;
    translate: string

  }
  lang: 'en' | 'fr'
};
export default function Demo({ dictionary, lang }: DemoProps) {
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery()
  const [article, setArticle] = useState({ url: "", summary: "" })
  const [frenchArticle, setFrenchArticle] = useState({ url: "", summary: "" })
  const [articles, setArticles] = useState<typeof article[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { data } = await getSummary({ articleUrl: article.url })
    if (data?.summary) {

      if (lang === 'fr') {
        const translatedArticle = await translateArticle(data.summary, lang)
        console.log(translatedArticle)
        const newArticle = {
          ...article, summary: translatedArticle
        }
        setFrenchArticle(newArticle)
        const updatedArticles = [newArticle, ...articles]
        localStorage.setItem('frenchArticles', JSON.stringify(updatedArticles))
      }
      const newArticle = {
        ...article, summary: data.summary
      }
      const updatedArticles = [newArticle, ...articles]
      setArticle(newArticle)
      localStorage.setItem('articles', JSON.stringify(updatedArticles))
    }
  }
  useEffect(() => {

    const localStorageArticles = JSON.parse(localStorage.getItem('articles') as string)
    const frenchLocalStorageArticles = JSON.parse(localStorage.getItem('frenchArticles') as string)
    if (localStorageArticles && lang === 'en') {
      setArticles(localStorageArticles)
    } else if (frenchLocalStorageArticles && lang === 'fr') {
      setArticles(frenchLocalStorageArticles)
    }
  }, [])
  return (
    <section className='mt-16 w-full max-w-xl px-10 md:p-0'>

      <div className="flex flex-col w-full gap-2">
        <form action="" className='relative flex justify-between items-center flex-col md:flex-row md:gap-2 gap-8' onSubmit={handleSubmit}>
          <Link2Icon className='absolute left-0 my-2 ml-3 w-5' />
          <Input type="url" placeholder={dictionary.place_holder} className='pl-10 peer shadow-md' onChange={(e) => setArticle({ ...article, url: e.target.value })} value={article.url} />
          <Button className='peer-invalid:cursor-not-allowed shadow-md'>
            {dictionary.button_children}
          </Button>

        </form>
        <div className='flex flex-col gap-1  overflow-y-auto mt-4'>
          {
            articles.map((article, index) => (<div key={`article-${index}`} onClick={() => setArticle(article)} className='p-3 flex justify-start items-center flex-row bg-background border  gap-3 rounded-lg cursor-pointer'>
              <div className='w-7 h-7 rounded-full bg-muted shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur flex justify-center items-center cursor-pointer'>
                <Copy className=' w-3 object-contain' />

              </div>
              <p className='flex-1 font-medium text-sm tex-blue-700 truncate'>{article.url}</p>

            </div>))
          }
        </div>
      </div>
      <div className='my-10 max-w-full flex justify-center items-center'>
        {
          isFetching ? (<Loader className='w-4 animate-spin' />) : error ? <p className='font-bold text-center'>Something went wrong </p> : (article.summary && <div className='flex flex-col gap-3'>
            <div className='flex justify-between'>

              <h2 className='font-bold text-xl'>
                <span className='text-orange-500'>{lang === 'en' ? "Summary" : "Résumé"}</span>
              </h2>
            </div>
            <div className='rounded-xl border bg-muted text-accent-foreground shadow-md backdrop-blur p-4'>
              <p>{article.summary }</p>
            </div>
          </div>)
        }
      </div>
    </section>
  );
};