fetch('http://www.nmc.cn/publish/satellite/FY4A-true-color.htm')
  .then((res) => {
    console.log(res.headers)
    return res.text()
  })
  .then((html) => {
    const result = []
  })
