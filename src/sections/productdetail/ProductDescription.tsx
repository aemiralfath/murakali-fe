import { H3, Avatar, A, P, Divider } from '@/components'
import cx from '@/helper/cx'
import React, { useState } from 'react'
import { HiChevronUp, HiChevronDown } from 'react-icons/hi'

// TODO: Integrate with Layout
const ProductDescription = () => {
  const [descriptionOpen, setDescriptionOpen] = useState(false)

  return (
    <>
      <H3>Sold By</H3>
      <div className="mt-4 items-center rounded border p-2 sm:flex sm:divide-x">
        <div className="flex items-center gap-4 pr-4">
          <Avatar size="lg" />
          <div className="w-fit overflow-ellipsis xl:w-[10rem]">
            <A className="font-semibold">MurakaliShop</A>
            <P className="text-sm">DKI Jakarta</P>
          </div>
        </div>
        <div className="mt-4 flex w-full flex-wrap items-center justify-between px-4 sm:mt-0 sm:justify-around">
          <div className="text-center">
            <P className="text-sm line-clamp-1">Rating</P>
            <P className="text-primary line-clamp-1">23K+</P>
          </div>
          <div className="text-center">
            <P className="text-sm line-clamp-1">Items Sold</P>
            <P className="text-primary line-clamp-1">132K+</P>
          </div>
          <div className="text-center">
            <P className="text-sm line-clamp-1">Item</P>
            <P className="text-primary line-clamp-1">89</P>
          </div>
        </div>
      </div>

      <H3 className="mt-8">Product Description</H3>
      <P className={cx('mt-2', descriptionOpen ? '' : 'line-clamp-[15]')}>
        WAJIB BACA SAMPAI SELESAI YAA!!
        <br /> Kaos distro Native8 model casual dengan desain yang beragam, unik
        dan berbeda dengan yang lain. Menggunakan bahan katun yang berkualitas
        tinggi, nyaman dipakai untuk melengkapi hari harimu.
        <br />
        <br /> Bahan : Cotton Combed 30S (Nyaman, tidak gerah, lembut, warna
        tidak cepat luntur, bahan tidak menyusut) (Khusus warna coksu/coklat
        muda memakai bahan cotton cvc twoton ya, makanya harganya berbeda)
        <br /> sablon: Plastisol High Density (Tidak pecah walau di cuci berkali
        kali.)
        <br /> - Jahitan standar distro Bandung, Overdeck kumis, jahitan pundak
        dirantai. Cocok dipakai laki-laki atau perempuan. <br />
        full hangtag
        <br />
        <br /> Perbedaan Warna produk dengan display pada settingan layar
        monitor anda dapat terjadi.
        <br />
        <br /> Hanya tersedia ukuran M , L, XL dan XXL <br />
        Detail ukuran : <br />M : Lebar Dada 48 cm x Panjang 70 cm <br />L :
        Lebar Dada 50 cm x Panjang 72 cm <br />
        XL : Lebar Dada 52 cm x Panjang 74 cm <br />
        XXL : Lebar Dada 55 cm x Panjang 76 cm <br />
        <br />
        Selisih 1-2 Cm pada produk mungkin terjadi dikarenakan proses
        pengembangan dan produksi. Untuk 1kg muat hingga 6 kaos (BELI BANYAK =
        HEMAT ONGKIR) Jangan lupa ambil voucher Diskon dan Gratis Ongkos Kirim,
        Gans
      </P>
      <div className="mt-4">
        <Divider>
          <button
            className="flex items-center gap-2 text-primary"
            onClick={() => {
              setDescriptionOpen(!descriptionOpen)
            }}
          >
            {descriptionOpen ? (
              <>
                Close <HiChevronUp />
              </>
            ) : (
              <>
                See More <HiChevronDown />
              </>
            )}
          </button>
        </Divider>
      </div>
    </>
  )
}

export default ProductDescription
