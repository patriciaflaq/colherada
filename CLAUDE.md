# Colherada

App de receitas em arquivo único. `index.html` contém HTML, CSS e todo o JS, incluindo
o array `SEED_RECIPES`. PWA servido pelo GitHub Pages a partir de `main`, publicado em
colherada.com.

## Regras permanentes de conteúdo

Valem para toda receita, sem exceção, tanto em receitas novas quanto em edições.

- **Sem alho.** Nenhuma receita leva alho. Alho-poró é permitido.
- **Gramas, ml e °C são obrigatórios.** Xícaras, colheres e scoops podem aparecer junto,
  como complemento. O que nunca entra é oz, lb e °F — esses sempre convertidos.
- **Adoçantes:** apenas alulose, monk fruit e stevia. Nenhum outro.
- **Português brasileiro** nos campos de receita (`name`, `notes`, `ingredients`, `steps`).
  Os campos `_en` são a tradução para inglês.

## Fluxo de receita nova

**Comentar antes de inserir. Só inserir depois de aprovação explícita.**

Ao receber uma receita nova, primeiro revisar e relatar, sem tocar no arquivo:

1. **Macros que não fecham** — proteína, carboidrato e gordura conferidos contra as
   calorias declaradas, e contra as quantidades reais dos ingredientes.
2. **Inconsistências entre ingredientes e preparo** — item listado que nunca é usado nos
   passos, ou passo que usa algo que não está na lista.
3. **Rendimento não declarado** — quantas porções, e se os macros são por porção ou do total.
4. **Alho a remover** — apontar onde aparece e o que fazer no lugar.

Só depois do OK, inserir. A inserção tem quatro partes, todas obrigatórias:

1. Inserir o objeto da receita em `SEED_RECIPES` **imediatamente antes da linha `{id:9,`**.
2. Adicionar a entrada correspondente em `NAMES`, com nome PT e EN.
3. Subir `SEED_VERSION` em 1.
4. Subir o `CACHE_NAME` do `sw.js` em 1.

Sem o passo 3 o merge versionado não roda e a receita não aparece para quem já tem dados
salvos. Sem o passo 4 o service worker continua servindo o HTML antigo do cache.

## Próximos valores livres

| | Próximo |
|---|---|
| id de receita | **107** |
| `SEED_VERSION` | **49** |
| `CACHE_NAME` | **v41** |

Atualizar esta tabela junto com cada receita inserida.

## Corrigir uma receita já publicada

Cada receita do `SEED_RECIPES` tem um campo `v`, começando em `1`. Ao corrigir uma receita
que já foi publicada, **subir o `v` dela em 1**. Sem isso a correção não chega em quem já
tem a receita salva no `localStorage` — o merge só insere o que falta, e a versão antiga
fica lá para sempre.

O que a atualização sobrescreve são os campos de autoria do seed, listados em `SEED_OWNED`:
`name`, `emoji`, `meal`, `diet`, `time`, `servings`, `notes`, `url`, `source`, os macros,
`ingredients`, `steps` e os campos `_en`.

O que ela nunca toca:

- **`fav`** — favoritar é do usuário.
- **Histórico e notas de cozinha** — moram em `colherada-history`, keyed por id, fora do
  objeto da receita.
- **Receitas editadas no app.** Editar pelo modal marca a receita com `edited:true` e ela
  passa a ser ignorada pelo merge. A versão do usuário manda, e a correção não chega nela.
- **Receitas criadas no app** — id via `Date.now()`, nunca casam com id do seed.

A checagem de `v` roda fora do gate do `SEED_VERSION`, então corrigir uma receita **não
exige** subir o `SEED_VERSION` junto. Ele continua sendo só para receitas novas.

Receita salva antes do campo `v` existir conta como `v:1` (`SEED_BASE_V`). Por isso a
linha de base é 1 e as correções começam em 2 — se `v` ausente contasse como zero, o
primeiro load sobrescreveria tudo de uma vez.

## SEED_VERSION e CACHE_NAME são independentes

São dois contadores separados, com propósitos diferentes: `SEED_VERSION` controla o merge
de receitas novas no `localStorage` de quem já usa o app, `CACHE_NAME` invalida o cache do
service worker. Cada um sobe pelos seus próprios motivos e eles **não devem ser alinhados**.
Hoje estão em 48 e v40. Divergirem é o esperado, não é bug — não "corrigir".

## Validação

**Não há runtime JS nesta máquina** — `node`, `deno` e `bun` não estão instalados, então
`node --check` não é uma opção. Para validar qualquer alteração no JS, servir por HTTP e
ler o console do browser:

```bash
python3 -m http.server 8765
```

Depois abrir `http://localhost:8765/index.html` e conferir que o console está limpo e que
o grid renderiza a contagem esperada de receitas.

Abrir o `index.html` direto por `file://` **não serve como teste**: em alguns browsers o
`localStorage` lança `SecurityError` nessa origem, o script aborta na primeira linha que o
acessa e a lista aparece vazia. É falha do ambiente, não do código.

## Mudanças visuais

Qualquer alteração de aparência — cores, tamanhos de fonte, espaçamento — precisa ser
**servida em localhost e revisada antes do commit**. Descrever a mudança em texto não
substitui olhar a tela.

O fluxo é: aplicar a alteração, subir o servidor, avisar que está no ar para revisão, e
**esperar aprovação explícita**. Só commitar depois disso.
