"use client"
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from "./ui/toast";
import { translateArticle } from '@/lib/utils';
import { Copy, Link2Icon, Loader2Icon } from 'lucide-react';
import { useLazyGetSummaryQuery } from '@/services/article';
import { Locale } from '@/config/i18n-config';
import Image from 'next/image';
import { wordCount, getURLContent } from '@/lib/utils';
interface DemoProps {
  dictionary: {
    place_holder: string;
    button_children: string;
    copy: string
    copy_message: string
    link: string
    resume: string
  }
  lang: 'en' | 'fr'
};

interface Article {
  url: string,
  summary: string,
  lang: Locale,
  translatedSummary: string
  originalLength?: number
  summaryLength?: number
}
export default function Demo({ dictionary, lang }: DemoProps) {
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery()
  const [article, setArticle] = useState<Article>({ url: "", summary: "", lang, translatedSummary: "", originalLength: 0, summaryLength: 0 })
  const [articles, setArticles] = useState<typeof article[]>([])
  const [isTranstlating, setisTranslating] = useState<boolean>(false)

  const handleTranslation = async (article: Article) => {
    if (article.lang === lang) {
      setArticle(article)
    } else {
      try {
        setisTranslating(true)
        const translation = await translateArticle(article.summary, article.lang, lang)
        setArticle({ ...article, translatedSummary: translation })
        setisTranslating(false)
      } catch (error) {
        setisTranslating(false)
        throw new Error("Error translating")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // get the article with the same url if it exists
    const existingArticle = articles.find((art) => art.url === article.url)
    if (existingArticle) {
      console.log("Article already exists in the list of articles")
      setArticle(existingArticle)
      return
    }
    // get the content of the url
    const urlContent = await getURLContent({ url: article.url })
    if (urlContent) {
      const articlength = wordCount(urlContent as string)
      const { data } = await getSummary({ articleUrl: article.url, lang: lang, })
      if (data?.summary) {
        const summaryLength = wordCount(data.summary)
        const newArticle = {
          ...article, summary: data.summary, lang, originalLength: articlength, summaryLength
        }
        const updatedArticles = [newArticle, ...articles]
        setArticle(newArticle)
        localStorage.setItem('articles', JSON.stringify(updatedArticles))
      }
    }
  }
  useEffect(() => {

    const localStorageArticles = JSON.parse(localStorage.getItem('articles') as string)
    if (localStorageArticles) {
      setArticles(localStorageArticles)
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
            articles.map((article, index) => (<div key={`article-${index}`} onClick={() => handleTranslation(article)} className='p-3 flex justify-start items-center flex-row bg-background border  gap-3 rounded-lg cursor-pointer'>
              <div className='w-7 h-7 rounded-full bg-muted shadow-[inset_10px_-50px_94px_0_rgb(199,199,199,0.2)] backdrop-blur flex justify-center items-center cursor-pointer'>
                <Copy className=' w-3 object-contain cursor-pointer' onClick={() => {
                  navigator.clipboard.writeText(article.url)

                  toast({
                    title: `${dictionary.copy}`,
                    message: `${dictionary.link} ${dictionary.copy_message}`,
                    type: "success"
                  })
                }} />
              </div>
              <p className='flex-1 font-medium text-sm tex-blue-700 truncate'>

                {article.url}</p>

            </div>))
          }
        </div>
      </div>
      <div className='my-10 max-w-full flex justify-center items-center'>
        {
          isFetching || isTranstlating ? (<Loader2Icon className='animate-spin w-10 h-10 text-orange-500' />) : error ? <p className='font-bold text-center'>{lang === 'fr' ? "Impossible de récuperer le contenu de l'url" : "Unable to get the url content"} </p> : (article.summary && <div className='flex flex-col gap-3'>
            <div className='flex justify-between'>

              <h2 className='font-bold text-xl'>
                <span className='text-orange-500'>{lang === 'en' ? "Summary" : "Résumé"}</span>
                <p>
                  {lang === 'en' ? "Original Article Length: " : "Longueur de l'article original: "}
                  {article.originalLength} {lang === 'en' ? "words" : "mots"}
                </p>
                <p>
                  {lang === 'en' ? "Summary Length: " : "Longueur du résumé: "}
                  {article.summaryLength} {lang === 'en' ? "words" : "mots"}
                </p>
              </h2>
            </div>
            <div className='rounded-xl border bg-muted text-accent-foreground shadow-md backdrop-blur p-4'>
              <Copy className=' w-3 object-contain cursor-pointer my-2' onClick={() => {
                navigator.clipboard.writeText(article.summary)

                toast({
                  title: `${dictionary.copy}`,
                  message: `${dictionary.resume} ${dictionary.copy_message}`,
                  type: "success"
                })
              }} />
              <p>{article.lang === lang ? article.summary : article.translatedSummary}</p>
            </div>
          </div>)
        }
      </div>
    </section>
  );
};